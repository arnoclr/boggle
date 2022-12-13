package fr.uge;

import java.sql.Timestamp;

public record DefinitionsFileHeader(String description, String language) implements JSON {
    @Override
    public String toJson() {
        var createdOn = new Timestamp(System.currentTimeMillis());
        return "{\"description\":\"%s\",\"created_on\":\"%s\",\"language\":\"%s\"}".formatted(description, createdOn.toString(), language);
    }
}
