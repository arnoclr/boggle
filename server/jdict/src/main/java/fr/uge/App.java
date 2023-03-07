package fr.uge;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

public class App {
    public static void main( String[] args ) throws FileNotFoundException, UnsupportedEncodingException, XMLStreamException {
        FilesCreation.createDefinitionFile();

        //final String fileName = "frwiktionary-latest-pages-articles.xml";
        final String fileName = "exemple.xml";
        final XMLInputFactory factory = XMLInputFactory.newInstance();
        final XMLStreamReader reader = factory.createXMLStreamReader(new FileInputStream(fileName));

        XMLManager xmlManager = new XMLManager();
        //xmlManager.getWords(reader);
        //xmlManager.getWordDefinition(reader, "lire");
    }
}
