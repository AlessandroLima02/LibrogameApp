const defaultDb = {
    lastIdNumber: 1,
    books: {
        "00000001": {
            id: "00000001",
            title: "Oltre il quarto mondo",
            description: "Sab e Ale, colti da un improvvisa amnesia, si ritrovano coinvolti in un viaggio inaspettato.",
            protagonist: "Sabrina",
            stats: [
                { id: "forza", name: "Forza", value: 1 },
                { id: "tempra", name: "Tempra", value: 1 },
                { id: "destrezza", name: "Destrezza", value: 1 },
                { id: "riflessi", name: "Riflessi", value: 1 },
                { id: "concentrazione", name: "Concentrazione", value: 1 },
                { id: "osservazione", name: "Osservazione", value: 1 }
            ],
            startingNodeId: "0",
            nodes: {
                "0": {
                    id: "0",
                    chapterTitle: "Capitolo 1 - Pagina 0",
                    text: "Ciao Sabrina! Questo è il mio regalo per te…Spero che ti piaccia!\n\nE’ un piccolo romanzo di cui sei protagonista, ma allo stesso tempo non è solo una storia!\n\nIn realtà è un librogame, ossia un libro dove spesso dovrai prendere delle decisioni che modificheranno il tuo destino!\n\nAttenta perché il tuo personaggio ha 6 statistiche che cambieranno l’esito delle tue azioni, quindi dacci un'occhiata! Per farlo vai su Menù -> Stats\n\nSpero che l’idea ti piaccia e che la storia ti coinvolga :)\n\nTi auguro buon divertimento!\n\n-Per Baby da il tuo Baby",
                    choices: [{ text: "Inizia Avventura", target: "1.1.a" }]
                },
                "1.1.a": {
                    id: "1.1.a",
                    chapterTitle: "Capitolo 1 - Pagina 1",
                    text: "Cado come in un pozzo infinito.\nI miei occhi sono chiusi… o forse è solo troppo buio per vedere qualcosa.\n\nUna voce mi raggiunge e il suo eco mi scuote: \n– Sabrina! Sabrina! –\n\nMa certo, è il mio nome. Ora lo ricordo, ma… dove sono? Vorrei chiederlo alla voce, ma le mie labbra sono sigillate, non esce neanche un fiato e… ho paura.\n\nCome sono finita qui e cosa sta succedendo? La mia mente si riempie di mille domande, fino al momento in cui quella voce mi parla di nuovo:\n– In cosa credi? –\n\nE in quel momento davanti a me compaiono tre distinte immagini: una spada, un mantello e un libro. Non capisco se le vedo davvero o se sono parte della mia immaginazione, però sento in qualche modo di poterle raggiungere.\nAllora mi allungo verso...",
                    choices: [
                        { text: "La spada", target: "1.spada", statMod: "forza", modValue: 2 },
                        { text: "Il mantello", target: "1.mantello", statMod: "riflessi", modValue: 2 },
                        { text: "Il libro", target: "1.libro", statMod: "concentrazione", modValue: 2 }
                    ]
                },
                "1.spada": {
                    id: "1.spada",
                    chapterTitle: "Capitolo 1 - Pagina 1",
                    text: "Non appena le mie dita sfiorano la spada, sento un'energia calda e pulsante scorrermi lungo tutto il braccio. È come se la forza del metallo stesso si stesse infondendo nei miei muscoli, rendendoli improvvisamente più tesi e pronti a scattare.",
                    choices: [{ text: "Avanti", target: "1.2.a" }]
                },
                "1.mantello": {
                    id: "1.mantello",
                    chapterTitle: "Capitolo 1 - Pagina 1",
                    text: "Sfioro il tessuto morbido del mantello, e improvvisamente mi sento leggera come una piuma. I miei sensi sembrano acuirsi, e avverto la netta sensazione che il mio corpo possa muoversi e reagire molto più velocemente di quanto abbia mai fatto.",
                    choices: [{ text: "Avanti", target: "1.2.a" }]
                },
                "1.libro": {
                    id: "1.libro",
                    chapterTitle: "Capitolo 1 - Pagina 1",
                    text: "Appoggio la mano sulla copertina di cuoio del libro. Una scintilla invisibile attraversa il palmo e risale dritta alla testa: la nebbia nei miei pensieri si dirada, e sento la mia mente farsi immediatamente più leggera, lucida e concentrata.",
                    choices: [{ text: "Avanti", target: "1.2.a" }]
                },
                "1.2.a": {
                    id: "1.2.a",
                    chapterTitle: "Capitolo 1 - Pagina 2",
                    text: "Neanche il tempo di allungarmi e ricomincio a cadere in questo abisso, sempre più veloce. Il cuore mi sale in gola e mi sento come risucchiata.\n\nMi stringo a me stessa e chiudo gli occhi più forte che posso, come se questo potesse proteggermi. Dopo un tempo apparentemente interminabile… mi sveglio.\n\nIl mio corpo si muove con un sussulto, come ogni volta che sogno di cadere, e ora finalmente sento di nuovo la consistenza del mio corpo. Sento un cigolio infinito accompagnato dallo scalpitare degli zoccoli di un cavallo, mentre vengo scossa in maniera irregolare.\n\nQualcosa mi tocca, o meglio qualcuno. Mi scuote le spalle insistentemente e piano piano inizio a sentirlo sussurrare: \n– Sabrina! Sabrina! –\n\nAllora apro gli occhi e lo vedo. È Ale, ma cosa sta succedendo?\nAncora un po’ stordita mi strofino gli occhi:\n– Buongiorno Baby, che succede? –\n– Non lo so stellina, ma sembra che ci abbiano catturati. –\n\nSolo in quel momento mi rendo conto delle catene che mi legano e del freddo che lasciano sulla mia pelle.",
                    choices: [
                        { text: "Provo a liberarmi", target: "3.a", stat: "forza", threshold: 3, failTarget: "3.b" },
                        { text: "Respiro profondamente", target: "3.c" },
                        { text: "Grido", target: "3.d" }
                    ]
                },
                "3.a": {
                    id: "3.a",
                    chapterTitle: "Capitolo 1 - Pagina 3",
                    text: "Cerco di scuotermi e liberarmi, di strapparmi di dosso queste catene e all’ennesimo strattone uno schiocco. La catena che univa le manette si è rotta. Evidentemente erano più fragili del previsto. Non ho mai visto Ale con un'espressione tanto stupita, che carino <3.",
                    choices: [{ text: "Avanti", target: "4" }]
                },
                "3.b": {
                    id: "3.b",
                    chapterTitle: "Capitolo 1 - Pagina 3",
                    text: "Cerco di scuotermi, di liberarmi, di strapparmi di dosso queste catene ma nulla: sembrano molto più resistenti del previsto.",
                    choices: [{ text: "Avanti", target: "4" }]
                },
                "3.c": {
                    id: "3.c",
                    chapterTitle: "Capitolo 1 - Pagina 3",
                    text: "L’aria si fa pesante nei polmoni mentre realizzo di essere stata catturata. Ale deve aver notato che il mio viso si è fatto buio e per un attimo si scurisce anche il suo.",
                    choices: [{ text: "Avanti", target: "4" }]
                },
                "3.d": {
                    id: "3.d",
                    chapterTitle: "Capitolo 1 - Pagina 3",
                    text: "Grido con tutta la forza che ho in corpo: \n– MA IN CHE SENSO? COSA SONO QUESTE MANETTE??? –\n\nAle mi guarda confuso, come se urlare non fosse la cosa più normale da fare in questa situazione… proprio non lo capisco.",
                    choices: [{ text: "Avanti", target: "4" }]
                },
                "4": {
                    id: "4",
                    chapterTitle: "Capitolo 1 - Pagina 4",
                    text: "Dopo un attimo sorride: \n– Pensavo ti piacesse essere ammanettata… –\nNon riesce mai ad essere serio, però mi fa sempre ridere:\n– Scemo –\nNon dico altro, non c’è bisogno.",
                    choices: [{ text: "Avanti", target: "4.b" }]
                },
                "4.b": {
                    id: "4.b",
                    chapterTitle: "Capitolo 1 - Pagina 4",
                    text: "– Non mi ricordo niente – dico.\n– Nemmeno io baby. L’ultimo ricordo che ho è una forte luce… e un mal di testa ancora più forte. –\nCi guardiamo attorno: un telo spesso copre il carro che ci trasporta, mentre della paglia morbida riveste il pavimento su cui fino a pochi istanti fa eravamo ancora stesi. I nostri occhi indugiano sul carro fino a posarsi finalmente sui lembi di telo che chiudono il fondo. Ci guardiamo e dopo un cenno scostiamo il telo.\nDiversi uomini seguono il carro, tutti portano casacche blu con ricami dorati mentre stivali di cuoio rosso come il sangue cingono i loro piedi.\nSembrano dei soldati, ma perché siamo loro prigionieri?\nAlle loro spalle rimane lo scheletro di un edificio, nudo, come se fosse stato spogliato delle sue stesse mura. Un bagliore verdastro cinge le rovine, ma la sua fonte ci rimane ignota.",
                    choices: [{ text: "Avanti", target: "5" }]
                },
                "5": {
                    id: "5",
                    chapterTitle: "Capitolo 1 - Pagina 5",
                    text: "Il carro riprende a muoversi verso la sua destinazione, ma dopo pochi minuti si arresta bruscamente in una strettoia della città. \nTratteniamo il fiato. Sentiamo le guardie là fuori discutere animatamente con qualcuno, poi i lembi delle tende davanti a noi si aprono di scatto.\nDue ragazzi si sporgono all'interno, portandosi l'indice alle labbra per invitarci a fare silenzio. Ci afferrano per le braccia, ci portano fuori dal carro senza fare rumore e, con gesti rapidi ed esperti, ci liberano dalle manette. Prima che i soldati possano accorgersi di nulla, aprono una pesante grata metallica e ci fanno scendere in dei vecchi canali di scolo inutilizzati per farci sparire.\n\nUna volta al sicuro nel buio umido del sottosuolo, uno dei due si volta verso di noi, ansante: – Tutto bene? Ma si può sapere che cazzo ci facevate là sopra? – ci chiede a bassa voce. \nIo e Ale ci scambiamo uno sguardo smarrito. \n– Noi... in realtà non ci ricordiamo nulla – ammetto, massaggiandomi i polsi indolenziti. – Non sappiamo nemmeno chi siano quei soldati o dove ci troviamo. – \nI due ragazzi si bloccano, fissandoci a bocca aperta. Quello che aveva parlato fa un passo avanti: – State scherzando? Voi siete parte del nostro gruppo! Fate parte della Resistenza! – esclama, visibilmente scosso. – Io sono Mark, e lui è Gino. Non vi ricordate? – \nScuotiamo la testa. Mark sospira, passandosi una mano tra i capelli, e inizia a spiegarci la situazione: – Il regime militare della città si fa ogni giorno più severo. A causa delle loro scelte folli, la popolazione là fuori sta letteralmente morendo di fame. E come se non bastasse, da quando è scoppiata la guerra, tutti i non umani... elfi, nani e chiunque abbia sangue diverso dal loro, vengono perseguitati e rastrellati senza tregua. Voi stavate lottando al nostro fianco per fermare tutto questo. –\n\nLe sue parole mi colpiscono dritte allo stomaco. Mi volto verso Ale per capire cosa ne pensa:",
                    choices: [
                        { text: "Fidarci di loro", target: "6.a" },
                        { text: "Restare scettici", target: "6.b" },
                        { text: "Rifiutare l'offerta", target: "6.c" }
                    ]
                },
                "6.a": {
                    id: "6.a",
                    chapterTitle: "Capitolo 1 - Pagina 6",
                    text: "Sento un calore improvviso accendersi nel petto. Nonostante la situazione assurda, la loro determinazione mi trasmette sicurezza.\n– Avete ragione, non possiamo restare qui – dico, facendo un passo avanti.\nAle mi poggia una mano sulla spalla, ancora un po' guardingo ma d'accordo:\n– Va bene, veniamo con voi. Ma muoviamoci. –\nMark annuisce, accennando un sorriso: – Ottima scelta. Seguitemi al rifugio. –",
                    choices: [{ text: "Avanti", target: "7" }]
                },
                "6.b": {
                    id: "6.b",
                    chapterTitle: "Capitolo 1 - Pagina 6",
                    text: "Mordo il labbro inferiore, indecisa. La loro proposta è logica, ma la prudenza non è mai troppa.\n– Veniamo con voi, ma a una condizione: appena arrivati vogliamo risposte chiare – metto in chiaro, incrociando le braccia.\nMark alza le mani in segno di intesa: – Affare fatto. Parola di Resistenza. –\nIo e Ale ci guardiamo prima di seguirli.",
                    choices: [{ text: "Avanti", target: "7" }]
                },
                "6.c": {
                    id: "6.c",
                    chapterTitle: "Capitolo 1 - Pagina 6",
                    text: "Faccio un passo indietro, scuotendo la testa con decisione.\n– No. Non vi conosciamo e non sappiamo quali siano le vostre reali intenzioni – dico a voce bassa ma ferma.\nMark ci guarda con un misto di compassione e severità:\n– Liberi di fare come volete. Ma se uscite da quel buco da soli, le guardie vi riprenderanno in cinque minuti. Noi vi offriamo una via d'uscita. –\nAle mi stringe la mano, sospirando: – Ha ragione, baby. Seguiamoli almeno per ora, non abbiamo alternative. Stiamo pronti a tutto. –",
                    choices: [{ text: "Avanti", target: "7" }]
                },
                "7": {
                    id: "7",
                    chapterTitle: "Capitolo 1 - Pagina 7",
                    text: "Partiamo seguendo Mark e Gino lungo questi stretti corridoi sotterranei. Camminiamo a lungo nel buio, guidati solo dalla fioca luce di una lanterna, fino a quando non risaliamo una scaletta arrugginita che ci fa sbucare in un altro vicolo cieco della città.\nMark sporge la testa oltre l'angolo e poi si ritrae subito, facendoci cenno di accucciarci dietro delle casse di legno.\n– Maledizione – sussurra. – Dobbiamo fare un pezzo all'esterno, sulla strada principale, prima di poter imboccare l'ingresso dell'altra galleria. –\nTendo l'orecchio: il rumore di stivali pesanti sul selciato è vicinissimo. Data la nostra scomparsa, le guardie stanno pattugliando i dintorni a tappeto.\n– Trovate gli Stranieri! Non possono essere andati lontano! – urla una voce roca poco più avanti.\nAggrotto la fronte e guardo Mark: – \"Gli Stranieri\"? Parlano di noi? –\nMark annuisce, improvvisando con prontezza: – Sì, vi chiamano così perché venite da fuori città... e perché ormai siete una coppia ben nota in questa zona. Siete sulla loro lista nera. –\nGuardo oltre le casse: l'ingresso della prossima galleria è a una cinquantina di metri, ma la strada pullula di pattuglie. Dobbiamo decidere come muoverci:",
                    choices: [
                        { text: "Muoversi furtivamente", target: "8.a", stat: "destrezza", threshold: 3, failTarget: "8.b" },
                        { text: "Correre veloci", target: "8.c", stat: "tempra", threshold: 3, failTarget: "8.d" },
                        { text: "Creare un diversivo", target: "8.e" }
                    ]
                },
                "8.a": {
                    id: "8.a",
                    chapterTitle: "Capitolo 1 - Pagina 8",
                    text: "Faccio un respiro lento e stringo la mano di Ale. Aspettiamo il momento esatto in cui le guardie danno le spalle al vicolo e iniziamo a muoverci.\nScivoliamo silenziosi come fantasmi da un'ombra all'altra, schiacciandoci contro i muri freddi e muovendo i passi in perfetta sincronia. Proprio mentre raggiungiamo l'imboccatura della galleria, però, Gino si ferma sulla soglia e scuote la testa: – Andate avanti voi con Mark – bisbiglia. – Le pattuglie sono troppo vicine. Io mi separo un attimo e faccio un giro largo per assicurarmi che nessuno ci segua. – Prima che possiamo protestare, sparisce silenziosamente nell'ombra.",
                    choices: [{ text: "Avanti", target: "10" }]
                },
                "8.b": {
                    id: "8.b",
                    chapterTitle: "Capitolo 1 - Pagina 8",
                    text: "Cerchiamo di avanzare in silenzio rasente il muro, ma la tensione mi gioca un brutto scherzo. Nel tentativo di schivare una pozzanghera, il mio piede urta in pieno una vecchia secchia di metallo abbandonata, che rotola sul selciato con un fracasso assordante. Il gelo mi cala addosso. Le guardie si voltano di scatto:\n– Eccoli! Gli Stranieri sono lì! Prendeteli! –\nSiamo stati beccati in pieno!",
                    choices: [{ text: "Avanti", target: "9" }]
                },
                "8.c": {
                    id: "8.c",
                    chapterTitle: "Capitolo 1 - Pagina 8",
                    text: "– Al mio tre, corriamo come se non ci fosse un domani – sussurro ad Ale. Lui mi sorride, stringendomi forte la mano: – Sempre pronto, stellina. – Scattiamo fuori dal vicolo a tutta velocità. Quando le guardie si accorgono di noi, abbiamo già guadagnato metà strada. Sento i polmoni bruciare per lo sforzo e il cuore martellarmi nelle orecchie, ma non cedo di un millimetro. Appena varcata la soglia della galleria, però, Gino si arresta di colpo, col fiatone: – Con questo baccano avranno capito la direzione! Proseguite con Mark, io resto indietro a confondere le acque! – E senza darci il tempo di replicare, si lancia in un vicolo secondario.",
                    choices: [{ text: "Avanti", target: "10" }]
                },
                "8.d": {
                    id: "8.d",
                    chapterTitle: "Capitolo 1 - Pagina 8",
                    text: "Decidiamo di giocarci il tutto per tutto e scattiamo verso la galleria correndo a più non posso. Ma il risveglio traumatico sul carro si fa sentire subito: dopo appena venti metri il fiato mi si spezza in gola e le gambe diventano pesanti come il piombo. Rallento vistosamente e le guardie, fresche e allenate, ci tagliano subito la strada sguainando le armi:\n– Fermi dove siete! Siete in trappola! –\nCi hanno beccati!",
                    choices: [{ text: "Avanti", target: "9" }]
                },
                "8.e": {
                    id: "8.e",
                    chapterTitle: "Capitolo 1 - Pagina 8",
                    text: "– Non ce la faremo mai a passare tutti e quattro lì in mezzo – sussurro. – Ci serve un diversivo. – Gino sorride e si sistema il colletto: – A questo ci penso io. Voi tenetevi pronti a correre verso la galleria appena vi sgombero la visuale! – Prima che possiamo ribattere, Gino sgattaiola dal lato opposto della strada, scaglia una pietra contro delle casse e si mette a urlare insulti contro i soldati. Le guardie abboccano all'istante e lo inseguono. Con la strada libera, io, Ale e Mark attraversiamo il piazzale inosservati e raggiungiamo l'ingresso della galleria. Ci fermiamo col fiato sospeso per attenderlo, ma i minuti passano e di Gino non c'è traccia. Mark ci tocca il braccio, invitandoci a scendere nel tunnel prima di essere scoperti.",
                    choices: [{ text: "Avanti", target: "10" }]
                },
                "9": {
                    id: "9",
                    chapterTitle: "Capitolo 1 - Pagina 9",
                    text: "Le guardie ci inseguono a distanza ravvicinata, i loro passi pesanti rimbombano nel vicolo insieme al clangore delle spade. Mark ci urla di muoverci, ma i soldati ci stanno letteralmente col fiato sul collo. Dobbiamo reagire in una frazione di secondo:",
                    choices: [
                        { text: "Cercare un nascondiglio", target: "9.a" },
                        { text: "Combattere", target: "9.b" }
                    ]
                },
                "9.a": {
                    id: "9.a",
                    chapterTitle: "Capitolo 1 - Pagina 9",
                    text: "– Presto, qui dentro! – bisbiglia Ale, tirandomi per un braccio dietro una catasta di vecchi teli, sotto il portico buio di una bottega abbandonata. Mark e Gino si infilano subito dietro di noi. Mi rannicchio contro il petto di Ale, trattenendo il respiro. La pattuglia sfreccia a pochi centimetri dal nostro nascondiglio. Quando i loro passi si disperdono, usciamo allo scoperto e arriviamo all'ingresso della galleria. Sulla soglia Gino si ferma: – Torneranno indietro a controllare – sussurra deciso. – Voi scendete con Mark. Io mi separo un momento per assicurarmi che non ci seguano. – Detto questo, si dilegua tra le ombre del vicolo.",
                    choices: [{ text: "Avanti", target: "10" }]
                },
                "9.b": {
                    id: "9.b",
                    chapterTitle: "Capitolo 1 - Pagina 9",
                    text: "Stanca di scappare, mi fermo di colpo e stringo i pugni, voltandomi verso i nostri inseguitori. Ale si affianca subito a me, pronto a lottare. Ma non appena la pattuglia svolta l'angolo, la dura realtà ci colpisce: non sono due soldati, ma una dozzina di uomini armati fino ai denti. Capiamo all'istante che non abbiamo alcuna speranza. – Siete pazzi?! Vi ammazzeranno! – ci grida Gino. – Andate via subito! Ci penso io a distrarli – – Ma Gino, è un suicidio! – protesto. – Conosco queste strade meglio delle mie tasche! Correte! – Senza lasciarci scelta, Gino si lancia in avanti urlando per attirare su di sé l'intera pattuglia. Mark ci trascina via a forza e corriamo col cuore in gola fino a tuffarci nell'ingresso sotterraneo della vecchia galleria.",
                    choices: [{ text: "Avanti", target: "10" }]
                },
                "10": {
                    id: "10",
                    chapterTitle: "Capitolo 1 - Pagina 10",
                    text: "Mentre ci addentriamo nel buio della nuova galleria, non riesco a togliermi dalla testa un forte senso di inquietudine. – Mark, dobbiamo tornare indietro o aspettarlo qui – dico con voce tesa, guardandomi alle spalle. – Là fuori è pieno di soldati! – Ale annuisce: – Se la caverà?. – Mark ci rivolge uno sguardo rassicurante, poggiando una mano sulla spalla di Ale: – Non temete per lui. Gino è una testa calda, ma sa cavarsela. Conosce ogni singolo tombino di questa città: vi assicuro che ci raggiungerà alla nostra base. Ora dobbiamo muoverci. –\n\nProseguiamo il cammino lungo il tunnel sotterraneo. Per spezzare la tensione, inizio a fare qualche domanda. – Senti, Mark... se davvero facciamo parte della Resistenza, puoi dirci qualcos’altro su di noi? – gli chiedo. Mark esita per una frazione di secondo, aggiustando la presa sulla lanterna: – Beh, in realtà non ci conosciamo bene di persona – risponde con calma. – Nella Resistenza siamo organizzati in divisioni indipendenti, per questioni di sicurezza. Voi due fate parte della Sesta Divisione... mentre io e Gino apparteniamo alla Quarta. –",
                    choices: [{ text: "Avanti", target: "11" }]
                },
                "11": {
                    id: "11",
                    chapterTitle: "Capitolo 1 - Pagina 11",
                    text: "Camminiamo in silenzio per qualche altro metro. Vedo il modo in cui Mark stringe la mascella quando parla dei soldati: c'è qualcosa di molto personale nel suo sguardo. – E tu, Mark? – provo a chiedergli avvicinandomi di un passo. – Cosa ti ha spinto a rischiare la vita qui sotto? Dov’è la tua famiglia? – Lui abbassa lo sguardo sulla fiamma della lanterna, chiudendosi nelle spalle. – Diciamo solo che questa città mi ha tolto tutto – risponde secco, con un filo di voce. Faccio passare un minuto di silenzio, poi gli sfioro delicatamente il braccio: – Se vuoi parlarne, noi ti ascoltiamo. – Mark sospira profondamente. Sente la sincerità nelle mie parole e la sua corazza cede un po'. – Avevo una famiglia normale... finché mia madre non si è ammalata gravemente – mormora a fatica, guardando il pavimento umido. – Le cure costavano troppo e noi eravamo ridotti alla fame. Così, per pagare i medici, mio padre ha fatto un gesto disperato... ha venduto mia sorella a un nobile locale, per farle fare la serva a palazzo. –",
                    choices: [{ text: "Avanti", target: "11.b" }]
                },
                "11.b": {
                    id: "11.b",
                    chapterTitle: "Capitolo 1 - Pagina 11",
                    text: "– È servito a salvarla? – chiedo a bassa voce. Mark scuote lentamente la testa. – No. Mia madre morì comunque. Distrutto dai sensi di colpa, mio padre perse completamente la ragione. Iniziò a bere e a sfogarsi su di me, giorno dopo giorno, finché non resse più il peso dei suoi rimorsi e si suicidò. – \n– E tua sorella? Sei riuscito a ritrovarla? – sussurro. Le nocche di Mark diventano bianche attorno al manico della lanterna. – Si dice che sia morta in un \"incidente\" a corte – risponde con un sorriso amaro. – Una bugia a cui nessuno si è opposto. Ecco perché combatto. Il mio unico sogno, ormai, è rendere questa città un posto degno di mia sorella. Lo faccio per lei... e perché nessun altro debba mai più soffrire così. –\n\nIl suo racconto ci lascia senza parole. Dopo altre chiacchiere per alleggerire il peso di quelle confessioni, la galleria termina davanti a un grande portone blindato, incastonato nella pietra. Mark si ferma, afferra il pesante anello di ferro della maniglia e si volta verso di noi con uno sguardo solenne: – Ragazzi... benvenuti alla base della Quarta Divisione. –",
                    choices: [{ text: "Avanti", target: "12" }]
                },
                "12": {
                    id: "12",
                    chapterTitle: "Capitolo 2 - Pagina 12",
                    text: "Il portone si apre scricchiolando, rivelando un nuovo capitolo della nostra storia...\n\n(Work in progress - Nuovi capitoli in arrivo!)",
                    choices: [
                        { text: "Work in Progress!", target: "RELOAD" }
                    ]
                }
            }
        }
    }
};