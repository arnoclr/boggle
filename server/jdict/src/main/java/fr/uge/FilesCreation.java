package fr.uge;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

public class FilesCreation {
    public static void createDefinitionFile() throws FileNotFoundException, UnsupportedEncodingException {
        PrintWriter writer = new PrintWriter("definitions", "UTF-8");
        writer.println(new DefinitionsFileHeader("file description", "fr").toJson());
        writer.close();
    }
}
