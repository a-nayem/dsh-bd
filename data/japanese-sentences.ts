export type Category = "Daily Life" | "Coding & Tech" | "Cybersecurity" | "Business & Freelance" | "PUBG Mobile";

export type Sentence = {
  jp: string;
  romaji: string; // pronunciation guide
  en: string;
  category: Category;
};

// Scoped to domains actually used day-to-day: general life, coding, security study,
// client/freelance work, and squad callouts for PUBG Mobile. Every entry carries
// romaji as the pronunciation reference alongside the audio button.
export const SENTENCES: Sentence[] = [
  // Daily Life
  { jp: "おはようございます。", romaji: "Ohayou gozaimasu.", en: "Good morning.", category: "Daily Life" },
  { jp: "お腹が空きました。", romaji: "Onaka ga sukimashita.", en: "I'm hungry.", category: "Daily Life" },
  { jp: "少し休みます。", romaji: "Sukoshi yasumimasu.", en: "I'll rest a bit.", category: "Daily Life" },
  { jp: "今日は何をしますか？", romaji: "Kyou wa nani o shimasu ka?", en: "What are you going to do today?", category: "Daily Life" },
  { jp: "また明日会いましょう。", romaji: "Mata ashita aimashou.", en: "Let's meet again tomorrow.", category: "Daily Life" },
  { jp: "少し疲れました。", romaji: "Sukoshi tsukaremashita.", en: "I got a little tired.", category: "Daily Life" },
  { jp: "お疲れ様でした。", romaji: "Otsukaresama deshita.", en: "Thanks for your hard work.", category: "Daily Life" },

  // Coding & Tech
  { jp: "今、コードを書いています。", romaji: "Ima, koodo o kaite imasu.", en: "I'm writing code right now.", category: "Coding & Tech" },
  { jp: "このバグを直します。", romaji: "Kono bagu o naoshimasu.", en: "I'll fix this bug.", category: "Coding & Tech" },
  { jp: "サーバーを再起動します。", romaji: "Saabaa o saikidou shimasu.", en: "I'll restart the server.", category: "Coding & Tech" },
  { jp: "テストが通りました。", romaji: "Tesuto ga toorimashita.", en: "The tests passed.", category: "Coding & Tech" },
  { jp: "プルリクエストを送りました。", romaji: "Puru rikuesuto o okurimashita.", en: "I sent a pull request.", category: "Coding & Tech" },
  { jp: "新しいプロジェクトを始めます。", romaji: "Atarashii purojekuto o hajimemasu.", en: "I will start a new project.", category: "Coding & Tech" },
  { jp: "この問題を解決しました。", romaji: "Kono mondai o kaiketsu shimashita.", en: "I solved this problem.", category: "Coding & Tech" },

  // Cybersecurity
  { jp: "脆弱性を見つけました。", romaji: "Zeijakusei o mitsukemashita.", en: "I found a vulnerability.", category: "Cybersecurity" },
  { jp: "パスワードを変更してください。", romaji: "Pasuwaado o henkou shite kudasai.", en: "Please change your password.", category: "Cybersecurity" },
  { jp: "このネットワークは安全です。", romaji: "Kono nettowaaku wa anzen desu.", en: "This network is safe.", category: "Cybersecurity" },
  { jp: "不正アクセスがありました。", romaji: "Fusei akusesu ga arimashita.", en: "There was unauthorized access.", category: "Cybersecurity" },
  { jp: "ログを確認してください。", romaji: "Rogu o kakunin shite kudasai.", en: "Please check the logs.", category: "Cybersecurity" },

  // Business & Freelance
  { jp: "見積もりを送ります。", romaji: "Mitsumori o okurimasu.", en: "I'll send the quote.", category: "Business & Freelance" },
  { jp: "締め切りはいつですか？", romaji: "Shimekiri wa itsu desu ka?", en: "When is the deadline?", category: "Business & Freelance" },
  { jp: "クライアントと話しました。", romaji: "Kuraianto to hanashimashita.", en: "I talked with the client.", category: "Business & Freelance" },
  { jp: "契約書を確認してください。", romaji: "Keiyakusho o kakunin shite kudasai.", en: "Please check the contract.", category: "Business & Freelance" },
  { jp: "会議は三時からです。", romaji: "Kaigi wa sanji kara desu.", en: "The meeting starts at three o'clock.", category: "Business & Freelance" },
  { jp: "この仕事はとても重要です。", romaji: "Kono shigoto wa totemo juuyou desu.", en: "This work is very important.", category: "Business & Freelance" },

  // PUBG Mobile — common squad callouts used by JP players in voice/text chat.
  // Framed as commonly-used community phrasing, not verbatim in-game quick-chat strings.
  { jp: "行くぞ！", romaji: "Ikuzo!", en: "Let's go!", category: "PUBG Mobile" },
  { jp: "降りるよ。", romaji: "Oriru yo.", en: "I'm dropping (landing).", category: "PUBG Mobile" },
  { jp: "敵発見！", romaji: "Teki hakken!", en: "Enemy spotted!", category: "PUBG Mobile" },
  { jp: "うしろにいる！", romaji: "Ushiro ni iru!", en: "There's someone behind you!", category: "PUBG Mobile" },
  { jp: "回復して。", romaji: "Kaifuku shite.", en: "Heal up.", category: "PUBG Mobile" },
  { jp: "弾薬ください。", romaji: "Dan'yaku kudasai.", en: "I need ammo.", category: "PUBG Mobile" },
  { jp: "エリアが狭くなる。", romaji: "Eria ga semaku naru.", en: "The zone is closing in.", category: "PUBG Mobile" },
  { jp: "カバーして。", romaji: "Kabaa shite.", en: "Cover me.", category: "PUBG Mobile" },
  { jp: "ダウンした！", romaji: "Daun shita!", en: "I'm downed!", category: "PUBG Mobile" },
  { jp: "蘇生して！", romaji: "Sosei shite!", en: "Revive me!", category: "PUBG Mobile" },
  { jp: "車に乗って！", romaji: "Kuruma ni notte!", en: "Get in the car!", category: "PUBG Mobile" },
  { jp: "最後の敵だ。", romaji: "Saigo no teki da.", en: "That's the last enemy.", category: "PUBG Mobile" },
  { jp: "集合して。", romaji: "Shuugou shite.", en: "Regroup.", category: "PUBG Mobile" },
  { jp: "撃たれた！", romaji: "Utareta!", en: "I got shot!", category: "PUBG Mobile" },
  { jp: "安全地帯に入って。", romaji: "Anzen chitai ni haitte.", en: "Get into the safe zone.", category: "PUBG Mobile" },
];
