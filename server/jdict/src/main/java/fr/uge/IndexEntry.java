package fr.uge;

import java.nio.ByteBuffer;
import java.text.Normalizer;
import java.text.Normalizer.Form;

public class IndexEntry implements Comparable<IndexEntry> {

    private String word;
    private long startByte;
    private long endByte;

    public IndexEntry(String word, long startByte, long endByte) {
        this.word = word;
        this.startByte = startByte;
        this.endByte = endByte;
    }

    public String getWord() {
        return word;
    }

    public long getStartByte() {
        return startByte;
    }

    public long getEndByte() {
        return endByte;
    }

    @Override
    public int compareTo(IndexEntry o) {
        String normalizedWord = Normalizer.normalize(word, Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase();
        String normalizedOtherWord = Normalizer.normalize(o.word, Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toUpperCase();
        int comparison = normalizedWord.compareTo(normalizedOtherWord);
        if (comparison == 0) {
            comparison = word.compareTo(o.word);
        }
        return comparison;
    }

    public byte[] toByteArray() {
        ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.putLong(startByte);
        buffer.putLong(endByte);
        return buffer.array();
    }
}