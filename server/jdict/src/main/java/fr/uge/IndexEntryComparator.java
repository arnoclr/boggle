package fr.uge;

import java.text.Normalizer;
import java.util.Comparator;

class IndexEntryComparator implements Comparator<IndexEntry> {

    @Override
    public int compare(IndexEntry o1, IndexEntry o2) {
        String normalizedWord1 = Normalizer.normalize(o1.getWord().toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();
        String normalizedWord2 = Normalizer.normalize(o2.getWord().toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").toUpperCase();

        int comparison = normalizedWord1.compareTo(normalizedWord2);
        if (comparison != 0) {
            return comparison;
        }

        return o1.getWord().compareTo(o2.getWord());
    }
}
