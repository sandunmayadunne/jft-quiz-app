const hiraganaData = [
    // Basic Hiragana (Gojuon)
    { romaji: "a", kana: "あ" }, { romaji: "i", kana: "い" }, { romaji: "u", kana: "う" }, { romaji: "e", kana: "え" }, { romaji: "o", kana: "お" },
    { romaji: "ka", kana: "か" }, { romaji: "ki", kana: "き" }, { romaji: "ku", kana: "く" }, { romaji: "ke", kana: "け" }, { romaji: "ko", kana: "こ" },
    { romaji: "sa", kana: "さ" }, { romaji: "shi", kana: "し" }, { romaji: "su", kana: "す" }, { romaji: "se", kana: "せ" }, { romaji: "so", kana: "そ" },
    { romaji: "ta", kana: "た" }, { romaji: "chi", kana: "ち" }, { romaji: "tsu", kana: "つ" }, { romaji: "te", kana: "て" }, { romaji: "to", kana: "と" },
    { romaji: "na", kana: "な" }, { romaji: "ni", kana: "に" }, { romaji: "nu", kana: "ぬ" }, { romaji: "ne", kana: "ね" }, { romaji: "no", kana: "の" },
    { romaji: "ha", kana: "は" }, { romaji: "hi", kana: "ひ" }, { romaji: "fu", kana: "ふ" }, { romaji: "he", kana: "へ" }, { romaji: "ho", kana: "ほ" },
    { romaji: "ma", kana: "ま" }, { romaji: "mi", kana: "み" }, { romaji: "mu", kana: "む" }, { romaji: "me", kana: "め" }, { romaji: "mo", kana: "も" },
    { romaji: "ya", kana: "や" }, { romaji: "yu", kana: "ゆ" }, { romaji: "yo", kana: "よ" },
    { romaji: "ra", kana: "ら" }, { romaji: "ri", kana: "り" }, { romaji: "ru", kana: "る" }, { romaji: "re", kana: "れ" }, { romaji: "ro", kana: "ろ" },
    { romaji: "wa", kana: "わ" }, { romaji: "wo", kana: "を" },
    { romaji: "n", kana: "ん" },

    // Tenten (Dakuten) - ゛
    { romaji: "ga", kana: "が" }, { romaji: "gi", kana: "ぎ" }, { romaji: "gu", kana: "ぐ" }, { romaji: "ge", kana: "げ" }, { romaji: "go", kana: "ご" },
    { romaji: "za", kana: "ざ" }, { romaji: "ji", kana: "じ" }, { romaji: "zu", kana: "ず" }, { romaji: "ze", kana: "ぜ" }, { romaji: "zo", kana: "ぞ" },
    { romaji: "da", kana: "だ" }, { romaji: "dji", kana: "ぢ" }, { romaji: "de", kana: "で" }, { romaji: "do", kana: "ど" },
    { romaji: "ba", kana: "ば" }, { romaji: "bi", kana: "び" }, { romaji: "bu", kana: "ぶ" }, { romaji: "be", kana: "べ" }, { romaji: "bo", kana: "ぼ" },

    // Maru (Handakuten) - ゜
    { romaji: "pa", kana: "ぱ" }, { romaji: "pi", kana: "ぴ" }, { romaji: "pu", kana: "ぷ" }, { romaji: "pe", kana: "ぺ" }, { romaji: "po", kana: "ぽ" }
];