package fr.uge;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.*;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

public class DictionaryMaker {

    public static void main(String[] args) throws IOException, XMLStreamException {
        /*
        if (args.length != 2) {
            System.out.println("Usage: java fr.uge.DictionaryMaker <wiktionary-dump-file> <output-file>");
            System.exit(1);
        }
        */

        //String inputFileName = args[0];
        //String outputFileName = args[1];
        String inputFileName = "frwiktionary-latest-pages-articles.xml";
        //String inputFileName = "exemple.xml";
        String outputFileName = "definitions";

        // Create a new XMLManager
        XMLManager xmlManager = new XMLManager();
        final XMLInputFactory factory = XMLInputFactory.newInstance();
        final XMLStreamReader inputFile = factory.createXMLStreamReader(new FileInputStream(inputFileName));

        // Open the output file
        RandomAccessFile outputFile = new RandomAccessFile(outputFileName, "rw");
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputFileName), "UTF-8"));

        // Initialize index list
        List<IndexEntry> indexList = new ArrayList<>();

        // Add header
        JsonObject json = new JsonObject();
        json.addProperty("description", "definition file");
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd'T'HHmmss'Z'");
        json.addProperty("created_on", format.format(new Date()));
        json.addProperty("language", "fr");
        bw.write(json.toString());
        bw.newLine();

        // Read the file xml
        boolean isWord = false; // Un mot est entre deux balises <title> et </title>
        boolean isDatas = false; // Toutes les datas d'un mot sont entre deux balises <text> et </text>
        String currentWord = "";
        StringBuilder stringWordDatas = new StringBuilder();

        // L'index
        List<IndexEntry> indexEntries = new ArrayList<>();
        long currentPosition;

        while (inputFile.hasNext()) {
            int event = inputFile.next();
            switch (event) {
                case XMLStreamConstants.START_ELEMENT:
                    if (inputFile.getLocalName().equals("title")) {
                        isWord = true;
                    } else if (inputFile.getLocalName().equals("text")) {
                        stringWordDatas = new StringBuilder();
                        isDatas = true;
                    }
                    break;
                case XMLStreamConstants.END_ELEMENT:
                    if (inputFile.getLocalName().equals("title")) {
                        isWord = false;
                    } else if (inputFile.getLocalName().equals("text")) {
                        isDatas = false;
                        JsonObject jsonWordDatas = parseDataStringToJson(stringWordDatas.toString());
                        if (jsonWordDatas != null) {
                            long startPosition = outputFile.length();
                            bw.write(jsonWordDatas.toString());
                            bw.newLine();
                            bw.flush();
                            outputFile.seek(outputFile.length());
                            long endPosition = outputFile.length();

                            String normalizedWord = Normalizer.normalize(currentWord.toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();
                            IndexEntry entry = new IndexEntry(normalizedWord, startPosition, endPosition);
                            indexEntries.add(entry);
                            System.out.println("Word: " + normalizedWord + " - Start: " + startPosition + " - End: " + endPosition);
                        }
                    }
                    break;
                case XMLStreamConstants.CHARACTERS:
                    // Si le mot est vide, on ignore
                    if (inputFile.isWhiteSpace()) {
                        break;
                    }

                    if (isWord) {
                        // Si le mot commence par "MediaWiki:" ou "Wiktionnaire:" ..., on l'ignore
                        if (!isWordValid(inputFile.getText())) {
                            break;
                        }
                        currentWord = inputFile.getText();
                        //System.out.println("Mot non normalisé: " + inputFile.getText());
                        String word = Normalizer.normalize(inputFile.getText().toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();
                        //System.out.println("Mot normalisé: " + word);
                    } else if (isDatas) {
                        if (stringWordDatas.length() < 1) stringWordDatas.append("[Word]{").append(currentWord).append("}\n");
                        stringWordDatas.append(inputFile.getText());
                    }
                    break;
            }
        }

        // Close the output file
        bw.close();
        outputFile.close();

        // Create the index file
        // Sort the index list
        indexEntries.sort(new IndexEntryComparator());
        // Insert the index list in the index file
        DataOutputStream dos = new DataOutputStream(new FileOutputStream(outputFileName + ".index"));
        dos.writeBytes("DICTINDX");
        for (IndexEntry entry : indexEntries) {
            // Write start position to 4 bytes and end position to 4 bytes
            dos.writeInt((int) entry.getStartByte());
            dos.writeInt((int) entry.getEndByte());
        }
        dos.close();

        System.out.println("Done");
    }

    public static boolean isAlphaNumeric(String s) {
        // Si il n'est pas null, si ce sont des alphanumérics et si il contient des accents ne n'est pas grave
        return s != null && s.matches("^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ0-9]+$");
    }

    public static boolean isWordValid(String word) {
        if (word.contains(":")) return false;
        if (word.contains(" ")) return false;
        return word.length() >= 2;
    }

    public static JsonObject parseDataStringToJson(String dataString) {
        JsonObject json = new JsonObject();
        String title = dataString.split("\n")[0];
        if (!isWordValid(title) || !dataString.contains("== {{langue|fr}} ==")) {
            return null;
        }

        title = title.substring(7, title.length() - 1);
        title = title.replace("}", "");
        if (!isAlphaNumeric(title)) return null;
        json.addProperty("title", title);

        JsonObject descriptions = new JsonObject();
        List<String> verbs = new ArrayList<>();
        List<String> nouns = new ArrayList<>();

        String[] lines = dataString.split("\n");
        boolean isVerb = false;
        boolean isNoun = false;
        for (String line : lines) {
            if (line.startsWith("=== {{S|verbe|fr")) {
                isVerb = true;
                isNoun = false;
                continue;
            } else if (line.startsWith("=== {{S|nom|fr}} ===")) {
                isNoun = true;
                isVerb = false;
                continue;
            }

            if (isVerb && line.startsWith("# ")) {
                verbs.add(line.substring(2));
            } else if (isNoun && line.startsWith("# ")) {
                nouns.add(line.substring(2));
            }
        }

        JsonArray verbsArray = new JsonArray();
        for (String verb : verbs) {
            verbsArray.add(verb);
        }
        descriptions.add("verbe", verbsArray);

        JsonArray nounsArray = new JsonArray();
        for (String noun : nouns) {
            nounsArray.add(noun);
        }
        descriptions.add("nom", nounsArray);

        json.add("descriptions", descriptions);
        return json;
    }
}