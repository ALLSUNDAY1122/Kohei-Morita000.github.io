from __future__ import annotations

from html import escape
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
DATE = "2026-07-18"

STORIES = [
    {
        "id": "SKK-007",
        "series": "榊家異聞",
        "eyebrow": "Sakaki Family Tales · SKK-007",
        "episode": "第7話",
        "title": "遺品の鍵束",
        "slug": "skk-007-ihin-no-kagitaba",
        "length": "中編",
        "minutes": 11,
        "fear": 4,
        "summary": "叔父の遺品から見つかった古い鍵束が、実家の同じ部屋へ家族ごとに異なる過去の用途を戻す。鍵束を返しても、無人の部屋は毎晩内側から施錠され、新しい鍵が増えていく。",
        "description": "叔父の遺品から見つかった古い鍵束が、実家の部屋へ異なる過去の用途を戻し、返却後も新しい鍵を増やしていく家族怪談。",
        "card": "叔父の遺品の鍵束が、同じ部屋へ家族ごとに異なる過去の用途を戻し、返却後も内側からの施錠を増やしていく。",
        "notice": "実在の家族、住宅、遺品、人物とは関係ありません。",
        "series_anchor": "series-sakaki",
        "genres": ["怪談", "ホラー", "家族", "遺品"],
        "body": r'''叔父が亡くなったのは、六月の終わりだった。
母の弟で、六十八歳。離婚後、駅前の古いマンションに一人で住んでいた。葬儀のあと、母と姉の香織と私の三人で、部屋の遺品を整理することになった。
叔父は物を分類する人だった。食器には購入年を書いた紙を貼り、工具箱には中身の一覧を入れていた。机の引き出しからは、部屋ごとに番号を振った遺品目録まで出てきた。
鍵束は、その目録に載っていなかった。
台所の吊り戸棚の奥、空の茶筒の中に入っていた。十本ほどの鍵が太い金属の輪に通されている。持ち上げると、冷たい重みが手のひらに沈んだ。
鍵はどれも古く、歯の形も長さも違っていた。表面には赤茶色の錆が浮き、指で触ると鉄の匂いが残った。
一つずつ、擦れた紙ラベルが巻かれていた。
「二階東」
「子」
「客」
「母」
「夜」
数字だけのものもあった。
３、５、７。
叔父のマンションは平屋の一室で、二階東など存在しない。子ども部屋も客間もなかった。母は鍵束を見て、しばらく黙っていた。
「これ、実家の鍵かもしれない」
私たちが今片づけている実家は、祖父母が建て、母と叔父が育った家だった。祖父母が亡くなったあと母が住み継ぎ、現在は母一人で暮らしている。
叔父は三十年前に家を出てから、合鍵を返したはずだった。
念のため、鍵束を持ち帰った。
最初に合ったのは、「二階東」と書かれた鍵だった。
実家の二階東側には物置がある。元は六畳の和室だったが、今は季節家電や古い布団を積んでいる。扉には十年前に交換した鍵がついていた。
叔父の鍵は、その鍵穴へ抵抗なく入った。
「同じメーカーだっただけでしょ」
姉がそう言った。
扉はもともと開いていた。私は試しに鍵を差し、右へ回した。
かちり、と小さく鳴った。
その瞬間、扉の向こうの空気が変わった。
六月なのに、部屋の中だけが冬の廊下のように冷えていた。積んであった扇風機や段ボールは消えていない。ただ、その間に学習机と低い本棚があった。
机の天板には、姉の名前が彫られていた。
「これ、私の部屋」
姉は迷わず中へ入った。
私は違うと思った。姉の子ども部屋は二階西側だった。東の和室は、祖母が客用布団を置く部屋だったはずだ。
母はさらに別のことを言った。
「ここは正明の部屋よ」
正明は叔父の名だ。
母の記憶では、叔父は高校を卒業するまでこの東の部屋を使い、姉も私も物置としてしか知らなかったことになっていた。
三人で同じ机を見ながら、誰の部屋だったかだけが一致しなかった。
私が鍵を左へ戻すと、室温が上がった。
机と本棚は消え、元の段ボールと扇風機だけになった。
翌日、「客」と書かれた鍵を一階北側の部屋で試した。
現在は母の寝室だ。鍵を回すと、畳の匂いが濃くなり、室温が夜の旅館のように低くなった。母のベッドの位置に、二組の客用布団が敷かれていた。
枕元には水の入ったコップが二つあった。
姉は、父方の祖父母が泊まった夜だと言った。
母は、祖父の葬儀で遠方の親戚を泊めた部屋だと言った。
私は、子どもの頃に高熱を出し、母と二人で寝た部屋だと思った。
布団もコップも、見る者の記憶に合わせて少しずつ意味が変わった。しかし物の位置は変わらない。
部屋を閉めると元へ戻った。
私たちは鍵を使うのをやめるべきだった。
だが、鍵束には番号があり、叔父の遺品目録にも同じ番号があった。
目録の末尾に、用途不明として三行だけ追加されていた。
３　現在
５　以前
７　内側
場所も品名も書かれていない。
三番の鍵は、台所脇の納戸に合った。
鍵を回した瞬間、冷蔵庫の音が遠くなった。納戸の棚が消えたわけではない。その手前に、小さな食卓と四脚の椅子が重なって見えた。
母は、ここが昔の台所だったと言った。
姉は、祖母が裁縫をしていた部屋だと言った。
私は、父が退職後に使った書斎だったと覚えていた。
三人の記憶に共通していたのは、叔父がその部屋の入口に立っていたことだけだった。
叔父は中へ入らず、いつも鍵を持っていた。
「正明は、この家の部屋を管理してたのかしら」
母が言った。
説明にはならなかった。
五番の鍵は、玄関横の和室に合った。
その夜、外は蒸し暑かった。廊下の温度計は二十八度を示していた。
鍵を回した和室だけ、十九度になった。
部屋には古い箪笥、子ども用の衣装ケース、介護用ベッドが同時にあった。どれも半透明で、現在の家具へ薄く重なっている。
姉は自分が幼い頃に寝た部屋だと言った。
母は祖母を看取った部屋だと言った。
私は、父が入院前の冬を過ごした部屋だと思った。
誰かが嘘をついているのではなかった。
鍵を回している間だけ、それぞれの記憶に合う生活配置が同時に戻っていた。
その日の深夜、「夜」と書かれた鍵も試した。
昼間はどの鍵穴にも入らなかったのに、午後十一時を過ぎると、居間と廊下を隔てるガラス戸の錠へ入った。
回すと室温は十六度まで下がった。現在のソファとテレビの上に、三組の布団、石油ストーブ、低い食卓が薄く重なった。
母は台風で停電した夜の居間だと言った。姉は正月に親戚が泊まった夜だと言った。私には、父の通夜のあと家族で仮眠した部屋に見えた。
どの記憶でも、叔父だけは眠らず戸口に座っていた。
膝の上に鍵束を置き、部屋の中ではなく、閉じた扉の数を指で数えていた。
鍵を戻すと布団もストーブも消えた。しかし、壁掛け時計だけが、以前とは違う柱へ移っていた。母は最初からそこに掛けていたと言い、姉も同意した。
元の柱には、時計を固定していたはずのねじ穴さえなくなっていた。
翌朝、母は食卓の椅子を一脚、納戸へ運ぼうとした。
「昔そこに置いてたから」
姉は押入れから自分の学習机の引き出しを探し始めた。
私は玄関横の和室へ、父の古い電気毛布を敷こうとしていた。
鍵を使っていない時間にも、戻ってきた部屋の使い方が私たちの行動へ残り始めていた。
鍵束を叔父の長男、従兄の隆へ返すことにした。
叔父には離婚した妻と息子がいた。疎遠だったため、葬儀後の整理は母が引き受けていたが、鍵束の所有者は隆だろうという結論になった。
渡す前の晩、七番の鍵だけを試した。
目録には「内側」とあった。
七番は、家中どの鍵穴にも合わなかった。
玄関、勝手口、物置、二階の各部屋。差し込めても途中で止まる。
最後に母が、廊下の突き当たりにある小さな戸を指した。
階段下の掃除用具入れだった。外側には取っ手だけで、鍵穴はない。
それでも母は言った。
「これは、そこよ」
姉も頷いた。
私も同じだと思った。
何を開ける鍵か、三人とも知っている感覚があった。
しかし、説明しようとすると言葉が出なかった。
その戸は外から開ける収納ではない。
内側から閉める部屋だった。
そう思った瞬間、戸の向こうから金属の擦れる音がした。
かちり。
鍵を掛ける音だった。
戸を開けると、箒と掃除機しかなかった。人が入れる奥行きではない。内側に鍵も掛け金もない。
ただ、床に小さな真鍮の鍵が一本落ちていた。
叔父の鍵束にはない新しい鍵だった。
ラベルも番号もなかった。
翌朝、鍵束は隆へ渡した。
叔父の部屋で見つけたことだけを説明し、実家で使った話はしなかった。
その夜、二階東の物置が内側から施錠されていた。
窓は閉まり、部屋には誰もいない。外側の鍵で開けると、扉の内側に見覚えのない小さな鍵が差さっていた。
次の夜は、母の寝室だった。
その次は台所脇の納戸。
どの部屋も、人がいないことを確認してから閉めている。それでも朝になると内側から鍵が掛かり、部屋の中に新しい鍵が一本残されている。
鍵は毎晩一つずつ増えた。
冷たい金属。錆のない歯。番号のない頭。
母はそれらを捨てず、食器棚の小皿に並べている。
今日で七本になった。
昨夜、姉から電話があった。
「次はどこだと思う？」
私は答えなかった。
家にはもう、鍵の掛かっていない部屋が一つしか残っていない。
私が今、寝ている部屋だ。''',
    },
    {
        "id": "KKS-S1E07",
        "series": "境界観測記",
        "eyebrow": "Boundary Observation · KKS-S1E07",
        "episode": "Season 1 Episode 7",
        "title": "名簿にない依頼人",
        "slug": "kks-s1e07-meibo-ni-nai-irainin",
        "length": "長編",
        "minutes": 14,
        "fear": 4,
        "summary": "正式な依頼書と面談記憶はあるが、依頼人の氏名だけが全名簿から欠落している。氏名確認をやめ、文書番号だけで公民館の安全処理を進める。",
        "description": "依頼人の氏名を検索するたび過去の相談記録が置き換わる。複数の最終版名簿を統合せず、公民館の安全確認を進める調査怪談。",
        "card": "氏名を検索するたび別の相談記録が置き換わる。三つの最終版名簿を統合せず、文書番号だけで依頼を処理する。",
        "notice": "実在の自治体、公民館、行政資料、人物とは関係ありません。",
        "series_anchor": "series-kansoku",
        "genres": ["怪談", "ホラー", "連作", "調査"],
        "body": r'''七件目の依頼は、閉鎖予定の公民館から届いた。
市立東丘公民館は、耐震改修のため二か月前から利用を停止している。建物内に残った備品と自治会資料を搬出したあと、年内に解体される予定だった。依頼内容は単純で、二階第三会議室の天井から粉が落ちるため、安全を確認してほしいというものだった。
不自然なのは、依頼人だった。
依頼書には市の受付印があり、文書番号も振られていた。
市相第〇七―一八四号。
受付日は三日前。相談種別は「施設安全」。第三会議室の位置、天井の状態、鍵の保管場所まで正確に書かれている。ところが、依頼人氏名を住民相談台帳で検索しても、利用者名簿で探しても、該当者がいなかった。
それだけなら、記入ミスで済んだかもしれない。
窓口職員三人が、その人物と面談したことを覚えていた。
年齢は五十代くらい。紺色の上着。濡れていない黒い傘を持ち、第三会議室を「上の小さい部屋」と呼んだ。三人の記憶は一致している。だが、名前を聞くと、三人とも違う答えを出した。
私は依頼書の写しを御厨へ渡した。
彼女は氏名欄を見てから、文書番号を指で隠した。
「佐伯さん。この名前を何回検索しましたか」
「窓口で四回。私が来てから二回です」
「検索するたび、結果はゼロ？」
「はい。ただし、相談台帳の件数が一件ずつ変わっています」
御厨は顔を上げた。
「増えたんですか」
「総数は同じです。別の相談が一件消えて、この依頼に置き換わっています」
最初に消えたのは、前年の騒音相談だった。次は、空き家の樹木についての相談。その次は、集会所の鍵紛失。どれも解決済みの古い記録で、検索前には画面に表示されていた。
検索後、その行には市相第〇七―一八四号が入っていた。
依頼人氏名だけは空欄のままだった。
窓口の入退室カメラにも、その人物らしい姿は残っていた。午後二時十三分に入り、二時三十八分に出ている。自動扉は開き、床の雨滴も増えていた。透明な存在でも、映像にだけ現れる影でもない。画面の中では普通の来庁者だった。
ただし、受付番号を表示する電光掲示には、その時間帯だけ番号が一つ欠けている。二十六番の次が二十八番になり、呼出音声も二十八番へ進んでいた。窓口職員は、その人物へ二十七番の札を渡したと覚えていた。
私は検索前の相談一覧をPDFで固定し、別端末をネットワークから切り離して比較した。氏名を一度入力すると、前年六月の相談番号が市相第〇七―一八四号へ変わった。作成日時と更新日時は元のまま、相談内容だけが第三会議室の天井へ置き換わっていた。
紙へ印刷した一覧は変化しなかった。
だが、印刷済みの行を指で確認しながらもう一度氏名を検索すると、今度は紙の相談者名が薄くなった。インクが消えたのではない。斜めから見ると文字の圧痕は残っているのに、正面からは空欄に見えた。
そこで検索を止めた。
「本人を確認しようとすると、別の誰かの記録を使う」
「そう見えます」
「依頼人が誰かより、依頼が何を求めているかを先に確認しましょう」
御厨の判断には同意した。ただ、相談台帳の改変を放置するわけにはいかない。
市の文書管理担当は、閉鎖した公民館の紙資料を仮保管している人物を紹介した。
真田章一。地域資料館の資料保全担当で、公民館から移送された自治会文書の整理を手伝っているという。
市役所別館の地下にある文書保管室で、真田は白い綿手袋を外して私たちを迎えた。背は高くない。銀縁の眼鏡をかけ、話す前に相手の持っている紙を見る癖があった。
御厨が先に名前を呼んだ。
「真田さん」
真田は一瞬だけ動きを止めた。
「久しぶりですね、御厨さん」
「知り合いですか」
私が聞くと、御厨は「以前、資料整理で」とだけ答えた。
真田も補足しなかった。
保管室には、灰色の保存箱が棚番号ごとに並んでいた。東丘公民館分は棚Dの四段目から六段目。箱の側面には、移送元、年度、内容、受入番号が鉛筆で書かれている。
真田は依頼人の名前を聞かなかった。
「文書番号を見せてください」
市相第〇七―一八四号を伝えると、彼は端末で文書受付簿を開き、番号だけで検索した。結果は一件。氏名欄は空白だが、受付時刻、担当窓口、添付資料二点が残っている。
添付の一つは第三会議室の手描き平面図。もう一つは、公民館の利用者名簿の写しだった。
名簿の上部には「閉館前最終版」と印字されている。
「最終版は一つではありません」
真田は棚から三箱を下ろした。
箱D4―11。箱D4―12。箱D5―02。
それぞれから同じ年度の利用者名簿が出てきた。表紙の文言は同じだが、右下の小さな版番号が違う。
最終版A、最終版B、最終版C。
Aには百八十七人。Bには百八十六人。Cには百八十八人が載っていた。
差分は三人ではない。
AにいてBにいない人物が七人。BにいてCにいない人物が五人。Cにだけいる人物が六人。合計人数が近いため、通常の確認では同じ名簿に見える。
「更新履歴は」
「ありません。三冊とも同じ日に最終版として綴じられています」
真田は付箋を三色に分け、氏名ではなく利用者番号で差を拾った。コピー機にはかけず、上から透明シートを置き、消える青鉛筆で位置を写す。原本の綴じ穴、紙の変色、ホチキス跡まで記録していた。
作業は慎重だったが、迷いがなかった。
「こういう名簿を見たことがあるんですか」
私が聞くと、真田は付箋を貼ったまま答えた。
「同じ表題で内容が異なる行政資料はあります。差し替え、訂正、部署ごとの保存時点。珍しくはありません」
「同じ日に三冊とも最終版になることも？」
「珍しいですが、起こり得ます」
御厨が言った。
「四冊目は？」
真田の手が止まった。
ほんの一秒だった。
「受入記録上は三冊です」
答えは正確に聞こえた。だが、三冊しかないとは言わなかった。
私は移送箱の一覧を確認した。東丘公民館から搬出された箱は十二箱。棚にあるのは十一箱だった。
「残り一箱は」
「紙に黴が出ていたので、別の環境で処置しています」
「中身は何ですか」
「文書群の原秩序が崩れるので、処置中の箱は開けません」
資料を守るための説明としては筋が通っていた。
それでも、御厨は真田を見ていた。
真田は視線を返さず、三冊の名簿を閉じた。
依頼書に添付された名簿は、A、B、Cのどれとも一致しなかった。
掲載順はCに近い。利用者番号はAの方式。余白の注意書きはBと同じ。複数版を混ぜたような一枚だった。
そして、依頼人氏名に該当する行だけ、利用者番号が振られていない。
「名前で追わない方がいいですね」
真田が言った。
「すでに市の相談台帳が置き換わっています」
「知っているんですか」
「依頼書の番号が、三冊すべての備考欄に現れています」
確認すると、確かに市相第〇七―一八四号が鉛筆で書かれていた。
さっき箱から出したときにはなかったはずだ。
真田は三冊を別々の中性紙封筒へ入れた。
「ここから先は、依頼人ではなく文書番号を主語にします。誰が頼んだかを確定しない。何を頼んだかだけを処理する」
御厨がうなずいた。
「確認を続ければ、名簿の別の行が依頼人の位置に使われるかもしれません」
「断定はできません。ただ、今起きている置き換えを増やす必要もありません」
真田は万能な答えを持っているわけではなかった。原因を説明せず、できる作業と、してはいけない作業を分けているだけだった。
私たちは東丘公民館へ移動した。
建物は正面玄関を合板で塞がれ、職員通用口だけが使われていた。第三会議室の鍵番号は依頼書の記載どおりだった。
二階廊下の突き当たりに、第三会議室がある。
広さは十二畳ほど。折り畳み机が六台。壁際に古い掲示板。天井には吸音板が並び、その一枚だけが五ミリほど下がっていた。
依頼書の平面図には、その位置へ赤い丸が付いている。
天井裏を確認すると、雨漏りではなかった。空調ダクトを吊る全ねじボルトの一本が緩み、金具が吸音板の裏へ接触していた。空調が動くと振動が伝わり、石膏粉が落ちる。解体前の短期間でも、板が外れる可能性があった。
「ここを知っている人なら、管理職員か工事関係者でしょうか」
私が言うと、御厨は首を振った。
「今は絞らない方がいい」
依頼人の特定ではなく、危険箇所の処理に集中した。
空調回路を停止し、第三会議室を立入禁止にした。現場代理人へ連絡し、吸音板とダクト金具を同時に撤去する手順を決めた。鍵は市職員立会いで封印し、依頼書番号を封印票へ記載した。
氏名欄は作らなかった。
作業中、異常は起きなかった。
市役所へ戻ると、相談台帳の置き換えも止まっていた。消えた三件の相談は復元できなかったが、それ以上は増えていない。
真田は三冊の名簿を一冊に統合しなかった。
A、B、Cのまま、それぞれ別の保存箱へ戻した。箱の中には差分表を入れず、文書番号と閲覧停止理由だけを書いた紙を添えた。
「正しい版を決めないんですか」
私が聞くと、真田は棚の扉を閉めた。
「正しい一冊を決めると、残りが誤りとして処分されます。今は、違うものが三冊あるという事実の方が重要です」
「処置中の一箱も？」
「保存対象です」
「中を見せられない？」
「今日は」
断り方が柔らかい分、意志は明確だった。
御厨は何も言わなかった。
帰り際、私は保管室の机に置かれた移送票を見た。
処置中の箱番号はD4―10。
内容欄は上から紙片で覆われていた。透けた文字の末尾だけが読めた。
――名簿・原本。
真田は私が見ていることに気づいたが、紙を隠さなかった。
ただ、説明もしなかった。
翌日、会社の経理から連絡があった。
東丘公民館の安全確認費について、市から支払先確認書が届いたという。依頼人を確定できなかったため、通常の依頼者名義では処理できず、文書番号に紐づく暫定口座が指定されていた。
確認書を開いた。
報酬の受取人欄には、三人の名前が並んでいた。
佐伯冬真。
御厨澪。
真田章一。
共同名義。
私たち三人の誰も、その口座を作っていなかった。
確認書の受付担当者欄には、今より細い筆跡で、真田章一と署名されていた。
その横の日付だけが、平成二十年になっていた。''',
    },
]

STYLE = '''
    :root{color-scheme:dark;--bg:#090b10;--ink:#eee6d8;--muted:#b7afa2;--dim:#847c72;--line:#312d2a;--paper:#151310;--accent:#8f2630;--gold:#c7a76a;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100dvh;background:radial-gradient(800px 440px at 75% -10%,rgba(143,38,48,.2),transparent 62%),linear-gradient(180deg,#090b10,#0d0e11 55%,#07080b);color:var(--ink)}body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.13;background:linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px) 0 0/42px 42px,linear-gradient(0deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/42px 42px}a{color:inherit}.skip{position:absolute;left:16px;top:-80px;background:var(--ink);color:#111;padding:10px 14px;z-index:10}.skip:focus{top:16px}.site-header{border-bottom:1px solid rgba(238,230,216,.1);background:rgba(9,11,16,.84);backdrop-filter:blur(14px);position:sticky;top:0;z-index:4}.nav{width:min(920px,calc(100% - 40px));min-height:62px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{text-decoration:none;display:flex;align-items:baseline;gap:12px}.brand strong{font-family:Georgia,"Yu Mincho","Hiragino Mincho ProN",serif;font-size:1.2rem;font-weight:500}.brand span,.back{color:var(--muted);font-size:.9rem}.back{text-decoration:none;border:1px solid var(--line);background:#13110f;padding:8px 11px}main{width:min(840px,calc(100% - 40px));margin:0 auto;padding:62px 0 80px}.eyebrow{margin:0 0 16px;color:var(--gold);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase}h1{font-family:Georgia,"Yu Mincho","Hiragino Mincho ProN",serif;font-size:clamp(2.5rem,7vw,4.5rem);font-weight:500;line-height:1.12;margin:0 0 20px}.summary{font-family:Georgia,"Yu Mincho","Hiragino Mincho ProN",serif;color:#ddd3c5;font-size:1.04rem;line-height:2;margin:0}.meta{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 42px}.meta span{border:1px solid var(--line);background:#13110f;color:var(--muted);padding:7px 10px;font-size:.84rem}article{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:42px 0}article p{font-family:Georgia,"Yu Mincho","Hiragino Mincho ProN",serif;font-size:1.05rem;line-height:2.12;letter-spacing:.02em;margin:0 0 1.3em}.notice{margin-top:28px;border-left:3px solid var(--accent);background:var(--paper);padding:18px 20px;color:var(--muted);line-height:1.8;font-size:.9rem}.footer-nav{display:flex;justify-content:space-between;gap:16px;margin-top:34px}.footer-nav a{text-decoration:none;border:1px solid var(--line);background:#13110f;padding:11px 14px}footer{border-top:1px solid rgba(238,230,216,.1);padding:30px 20px;color:var(--dim);text-align:center;font-size:.88rem}:focus-visible{outline:3px solid var(--gold);outline-offset:4px}@media(max-width:600px){.nav{width:min(100% - 28px,920px);align-items:flex-start;flex-direction:column;padding:13px 0}main{width:min(100% - 28px,840px);padding-top:40px}article{padding:30px 0}article p{font-size:1rem;line-height:2.02}.footer-nav{flex-direction:column}}
'''.strip()


def page_html(story: dict) -> str:
    url = f"https://allsunday1122.github.io/kyokai-yawa/stories/{story['slug']}.html"
    paras = "\n".join(f"      <p>{escape(line)}</p>" for line in story["body"].strip().splitlines() if line.strip())
    structured = {
        "@context": "https://schema.org",
        "@type": "ShortStory",
        "headline": story["title"],
        "description": story["description"],
        "isPartOf": {"@type": "CreativeWorkSeries", "name": story["series"]},
        "inLanguage": "ja",
        "url": url,
        "datePublished": DATE,
        "timeRequired": f"PT{story['minutes']}M",
        "genre": story["genres"],
    }
    return f'''<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{escape(story['title'])}｜{escape(story['series'])}｜境界夜話</title>
  <meta name="description" content="{escape(story['description'], quote=True)}">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <meta name="theme-color" content="#090b10">
  <link rel="canonical" href="{url}">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="境界夜話">
  <meta property="og:title" content="{escape(story['title'], quote=True)}｜{escape(story['series'], quote=True)}">
  <meta property="og:description" content="{escape(story['description'], quote=True)}">
  <meta property="og:url" content="{url}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">{json.dumps(structured, ensure_ascii=False, separators=(',', ':'))}</script>
  <style>
{STYLE}
  </style>
</head>
<body>
  <a class="skip" href="#story">本文へ移動</a>
  <header class="site-header"><nav class="nav" aria-label="主要メニュー"><a class="brand" href="/kyokai-yawa/"><strong>境界夜話</strong><span>怪談アーカイブ</span></a><a class="back" href="/kyokai-yawa/#works">公開作品へ戻る</a></nav></header>
  <main>
    <p class="eyebrow">{escape(story['eyebrow'])}</p>
    <h1>{escape(story['title'])}</h1>
    <p class="summary">{escape(story['summary'])}</p>
    <div class="meta" aria-label="作品情報"><span>{escape(story['series'])}</span><span>{escape(story['episode'])}</span><span>{escape(story['length'])}</span><span>約{story['minutes']}分</span><span>恐怖レベル {story['fear']}</span></div>
    <article id="story" tabindex="-1">
{paras}
    </article>
    <p class="notice">この作品はフィクションです。完全オリジナル作品として編集確認を経て掲載しています。{escape(story['notice'])}</p>
    <nav class="footer-nav" aria-label="作品ページ下部メニュー"><a href="/kyokai-yawa/">境界夜話トップ</a><a href="/kyokai-yawa/#{story['series_anchor']}">{escape(story['series'])}を見る</a></nav>
  </main>
  <footer>© 2026 境界夜話</footer>
</body>
</html>
'''


def card(story: dict) -> str:
    return f'''      <a class="work-card" href="/kyokai-yawa/stories/{story['slug']}.html"><div><span class="id">{story['id']} · {story['series']}</span><h3>{story['title']}</h3><p>{story['card']}</p></div><div class="work-meta"><span class="tag">{story['length']}</span><span class="tag">約{story['minutes']}分</span><span class="tag">恐怖 {story['fear']}</span></div></a>'''


def list_item(story: dict) -> str:
    return f'''<li><a class="story-link" href="/kyokai-yawa/stories/{story['slug']}.html"><span class="story-id">{story['id']}</span><span class="story-title">{story['title']}</span><span class="story-arrow">›</span></a></li>'''


for story in STORIES:
    path = ROOT / "stories" / f"{story['slug']}.html"
    if path.exists():
        raise RuntimeError(f"Refusing to overwrite existing story: {path}")
    path.write_text(page_html(story), encoding="utf-8")

index_path = ROOT / "index.html"
index = index_path.read_text(encoding="utf-8")

skk, kks = STORIES
skk_card_marker = '      <a class="work-card" href="/kyokai-yawa/stories/skk-010-futatsu-no-ie-no-komoriuta.html">'
kks_card_marker = '      <a class="work-card" href="/kyokai-yawa/stories/kks-s1e08-kyu-kansokuto-no-kagi.html">'
if skk_card_marker not in index or kks_card_marker not in index:
    raise RuntimeError("Card insertion marker missing")
index = index.replace(skk_card_marker, card(skk) + "\n" + skk_card_marker, 1)
index = index.replace(kks_card_marker, card(kks) + "\n" + kks_card_marker, 1)

skk_list_marker = '<li><a class="story-link" href="/kyokai-yawa/stories/skk-010-futatsu-no-ie-no-komoriuta.html">'
kks_list_marker = '<li><a class="story-link" href="/kyokai-yawa/stories/kks-s1e08-kyu-kansokuto-no-kagi.html">'
if skk_list_marker not in index or kks_list_marker not in index:
    raise RuntimeError("Series insertion marker missing")
index = index.replace(skk_list_marker, list_item(skk) + skk_list_marker, 1)
index = index.replace(kks_list_marker, list_item(kks) + kks_list_marker, 1)
index = index.replace('<h3>榊家異聞</h3><span class="series-count">7話公開</span>', '<h3>榊家異聞</h3><span class="series-count">8話公開</span>', 1)
index = index.replace('<h3>境界観測記</h3><span class="series-count">7話公開</span>', '<h3>境界観測記</h3><span class="series-count">8話公開</span>', 1)
index_path.write_text(index, encoding="utf-8")

sitemap_path = ROOT / "sitemap.xml"
sitemap = sitemap_path.read_text(encoding="utf-8")
skk_url = f'  <url><loc>https://allsunday1122.github.io/kyokai-yawa/stories/{skk["slug"]}.html</loc><lastmod>{DATE}</lastmod></url>'
kks_url = f'  <url><loc>https://allsunday1122.github.io/kyokai-yawa/stories/{kks["slug"]}.html</loc><lastmod>{DATE}</lastmod></url>'
skk_site_marker = '  <url><loc>https://allsunday1122.github.io/kyokai-yawa/stories/skk-010-futatsu-no-ie-no-komoriuta.html</loc>'
kks_site_marker = '  <url><loc>https://allsunday1122.github.io/kyokai-yawa/stories/kks-s1e08-kyu-kansokuto-no-kagi.html</loc>'
if skk_site_marker not in sitemap or kks_site_marker not in sitemap:
    raise RuntimeError("Sitemap insertion marker missing")
sitemap = sitemap.replace(skk_site_marker, skk_url + "\n" + skk_site_marker, 1)
sitemap = sitemap.replace(kks_site_marker, kks_url + "\n" + kks_site_marker, 1)
sitemap_path.write_text(sitemap, encoding="utf-8")

# Validation before committing.
if index.count('class="work-card"') != 32:
    raise RuntimeError(f"Expected 32 work cards, got {index.count('class=\"work-card\"')}")
for series in ("真壁夜話", "黒瀬蒐集録", "榊家異聞", "境界観測記"):
    if f'<h3>{series}</h3><span class="series-count">8話公開</span>' not in index:
        raise RuntimeError(f"Series count not updated: {series}")
if sitemap.count("<loc>") != 33:
    raise RuntimeError(f"Expected 33 sitemap URLs, got {sitemap.count('<loc>')}")
for story in STORIES:
    html = (ROOT / "stories" / f"{story['slug']}.html").read_text(encoding="utf-8")
    first = story["body"].strip().splitlines()[0]
    last = story["body"].strip().splitlines()[-1]
    if escape(first) not in html or escape(last) not in html:
        raise RuntimeError(f"Story boundary validation failed: {story['id']}")

# Remove the one-time publisher and trigger/workflow from the resulting tree.
for temp in [
    ROOT / "publish_batch_20260718.py",
    ROOT / "publish-batch-20260718.trigger",
    ROOT / ".github" / "workflows" / "publish-batch-20260718.yml",
]:
    if temp.exists():
        temp.unlink()

subprocess.run(["git", "config", "user.name", "github-actions[bot]"], cwd=ROOT, check=True)
subprocess.run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"], cwd=ROOT, check=True)
subprocess.run(["git", "add", "index.html", "sitemap.xml", "stories", "publish_batch_20260718.py", "publish-batch-20260718.trigger", ".github/workflows/publish-batch-20260718.yml"], cwd=ROOT, check=True)
subprocess.run(["git", "commit", "-m", "Publish SKK-007 and KKS-S1E07"], cwd=ROOT, check=True)
subprocess.run(["git", "push", "origin", "HEAD:main"], cwd=ROOT, check=True)
