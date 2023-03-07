package fr.uge;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.Arrays;

public class DictionarySearcher {

    private RandomAccessFile definitionsFile;
    private RandomAccessFile indexFile;

    public DictionarySearcher(String definitionsFileName, String indexFileName) {
        try {
            this.definitionsFile = new RandomAccessFile(definitionsFileName, "r");
            this.indexFile = new RandomAccessFile(indexFileName, "r");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String searchWord(String word) throws IOException {
        String normalizedWord = Normalizer.normalize(word.toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();
        // Skip the header "DICTINDX"
        indexFile.seek(8);
        int low = 0;
        int high = (int) (indexFile.length() / 8) - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            indexFile.seek(8 + mid * 8);
            byte[] posBytes = new byte[8];
            indexFile.read(posBytes, 0, 8);
            // StartByte is from 0 to 4 and EndByte is from 4 to 8
            long startByte = ByteBuffer.wrap(Arrays.copyOfRange(posBytes, 0, 4)).getInt();
            long endByte = ByteBuffer.wrap(Arrays.copyOfRange(posBytes, 4, 8)).getInt();
            //System.out.println("startByte: " + startByte + " endByte: " + endByte);
            byte[] wordBytes = new byte[(int) (endByte - startByte)];
            definitionsFile.seek(startByte);
            byte[] definitionBytes = new byte[(int)(endByte - startByte)];
            definitionsFile.read(definitionBytes, 0, (int)(endByte - startByte));
            String definitionJsonString = new String(definitionBytes);
            JsonObject definitionJson = JsonParser.parseString(definitionJsonString).getAsJsonObject();
            //System.out.println("Json: " + definitionJson);
            String currentWord = definitionJson.get("title").getAsString();
            // Normalize the word to remove accents and diacritics
            String normalizedCurrentWord = Normalizer.normalize(currentWord, Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();
            //System.out.println("normalizedCurrentWord: " + normalizedCurrentWord);
            if (normalizedCurrentWord.compareTo(normalizedWord) < 0) {
                low = mid + 1;
            } else if (normalizedCurrentWord.compareTo(normalizedWord) > 0) {
                high = mid - 1;
            } else {
                return definitionJsonString;
            }
        }
        return null;
    }

    public static void main(String[] args) throws IOException {

        /*if (args.length != 2) {
            System.out.println("Usage: java fr.uge.DictionarySearcher definitions congres");
            System.exit(1);
        }*/

        DictionarySearcher searcher = new DictionarySearcher("definitions", "definitions.index");

        //String definition = searcher.searchWord(args[1]);
        //System.out.println(args[1]);

        /* TESTER AVEC VOTRE MOT */
        String definition = searcher.searchWord("pomme");
        /* TESTER AVEC VOTRE MOT */

        if (definition != null) {
            System.out.println(definition);
        } else {
            System.out.println("Word not found");
        }
        //java -cp Jdict-jar-with-dependencies.jar fr.uge.DictionarySearcher definitions congres

    }
}




