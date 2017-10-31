var queryUrl = 'https://fr.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&format=json&titles='

var resGetJSON = {"batchcomplete":"","query":{"pages":{"3553494":{"pageid":3553494,"ns":0,"title":"Napol\u00e9on","revisions":[{"contentformat":"text/x-wiki","contentmodel":"wikitext","*":"#REDIRECTION [[Napol\u00e9on Ier]]"}]}}}}
var resPagesJSON = resGetJSON.query.pages
var thetext = resPagesJSON[Object.keys(resPagesJSON)[0]].revisions[0]['*']
if (resPagesJSON["-1"]||thetext.indexOf('{{homonymie}}\n{{Autres projets')!=-1) {
	// get another word
}
if (thetext.indexOf('#REDIRECTION')!=-1) {
	// follow redirection or get another word
}

function extractText(text) {
	var res = text
	
	res = res.replace(/\{(.*?)\}/g,'')
	res = res.split('}').join('')
	// take only the text
	//res = res.split('}}')[res.split('}}').length-1]
	// remove ]] and '''
	res = res.split(']]').join('')
	res = res.split('\'\'\'').join('')
	// remove all text between [ and |
	res = res.replace(/\[(.*?)\|/g,'')
	// remove ]
	res = res.split('[').join('')

	return res
}

function getSentence(text) {
	var etext = extractText(text).split('.')
	var index = etext.length-2
	while (index>=0 && etext[index].indexOf('|')!=-1) {
		index--
	}
	return etext[index]
}

function browserify(text) {
	if (text) return text.replace(/\n/g, "<br>")
	else return 'no data...'
}

function newWord() {
	//var restext = "{{Semi-protection longue}}\n\n{{Voir homonymes|Pizza (homonymie)}}\n{{Infobox Mets\n | nom            = Pizza \n | image          = Eq it-na pizza-margherita sep2005 sml.jpg\n | l\u00e9gende        = [[Pizza napolitaine]]\n | autre nom      = \n | lieu origine   = {{Italie}} ([[Naples]])\n | cr\u00e9ateur       = \n | date           = \n | place service  = [[Entr\u00e9e (cuisine)|Entr\u00e9e]] ou [[plat principal]]\n | temp\u00e9rature    = Chaude ou froide\n | ingr\u00e9dients    = [[Fromage]], [[huile d'olive]], [[l\u00e9gume]]s, [[Farine panifiable|farines de c\u00e9r\u00e9ales]]\n | variations     = \n | accompagnement = \n | classification = \n}}\nLa '''pizza''' est une [[tarte|mon cul]] d'origine [[italie]]nne, faite d'une p\u00e2te \u00e0 pain \u00e9tal\u00e9e et de [[Sauce tomate|coulis de tomate]], recouverte de divers ingr\u00e9dients et cuite au [[four]] (\u00e0 bois, \u00e0 gaz ou \u00e9lectrique). La pizza est un des mets de la [[cuisine italienne]] qui s'est \u00e9tabli presque partout dans le monde, souvent en s'adaptant aux go\u00fbts locaux."
	//var restext = "{{Semi-protection longue}}\n{{sous-titre/Taxon|ns1=Canis lupus familiaris}}\n{{Voir homonymes|Chien (homonymie)}}\n{{Taxobox d\u00e9but | animal | ''Canis lupus familiaris'' | Assemblage_chien.jpg | ''Aper\u00e7u d'utilisations du chien ''<br /> En haut : un chien de grande course<br /> \u00c0 gauche : un chien militaire<br /> En haut \u00e0 droite : un chien d'assistance<br /> En bas \u00e0 droite : des chiens de traineau | classification=msw}}\n{{Taxobox | embranchement | Chordata}}\n{{Taxobox | classe | Mammalia}}\n{{Taxobox | ordre | Carnivora}}\n{{Taxobox | sous-ordre | Caniformia}}\n{{Taxobox | famille | Canidae}}\n{{Taxobox | genre | Canis}}\n{{Taxobox | esp\u00e8ce | Canis lupus}}\n{{Taxobox taxon | animal | sous-esp\u00e8ce | Canis lupus familiaris | ([[Carl von Linn\u00e9|Linnaeus]], [[1758]])}}\n{{Taxobox synonymes |\n* ''{{lang|la|C. familiaris}}'' <small>Linnaeus, 1758</small>\n* ''{{lang|la|C. f. domesticus}}'' <small>Linnaeus, 1758</small>\n* ''{{lang|la|C. canis}}''\n}}\n{{Taxobox fin}}\n\nLe '''chien''' ('''''{{lang|la|Canis lupus familiaris}}''''') est la [[sous-esp\u00e8ce]] [[Domestication|domestique]] de ''[[Canis lupus]]'', un [[mammif\u00e8re]] de la [[Famille (biologie)|famille]] des [[Canidae|Canid\u00e9s]] (Canidae), laquelle comprend \u00e9galement le [[loup gris]] et le [[Dingo (chien sauvage)|dingo]], chien domestique redevenu sauvage. \n\nLe chien est la premi\u00e8re [[esp\u00e8ce|esp\u00e8ce animale]] \u00e0 avoir \u00e9t\u00e9 [[Domestication du chien|domestiqu\u00e9e par l'Homme]] pour l'usage de la chasse dans une soci\u00e9t\u00e9 humaine [[pal\u00e9olithique]] qui ne maitrise alors ni l'agriculture ni l'\u00e9levage. La lign\u00e9e du chien s'est diff\u00e9renci\u00e9e g\u00e9n\u00e9tiquement de celle du [[loup gris]] il y a environ {{unit\u00e9|100000|ans}}<ref>{{Lien web|url=http://archaeology.about.com/od/domestications/qt/dogs.htm|site=About.com - Archaeology|titre=Dog History How were Dogs Domesticated?|auteur=K. Kris Hirst}} - ''{{Citation \u00e9trang\u00e8re|Dog history has been studied recently using mitochondrial DNA, which suggests that wolves and dogs split into different species around 100,000 years ago\u2026|langue=en}}''</ref>, et les plus anciens restes confirm\u00e9s de canid\u00e9 diff\u00e9renci\u00e9 de la lign\u00e9e du loup sont vieux, selon les sources, de {{unit\u00e9|33000|ans}}<ref name=altai-dog-dna>{{Article|nom1= Druzhkova |pr\u00e9nom1= A.S.\n |nom2= Thalmann |pr\u00e9nom2= O.\n |nom3= Trifonov |pr\u00e9nom3= V.A.\n |nom4= Leonard |pr\u00e9nom4= J.A.\n |nom5= Vorobieva |pr\u00e9nom5= N.V.\n |et al.= oui\n |ann\u00e9e= 2013\n |langue= en\n |titre= Ancient DNA Analysis Affirms the Canid from Altai as a Primitive Dog\n |p\u00e9riodique= PLoS ONE |volume= 8 |num\u00e9ro= 3\n |doi= 10.1371/journal.pone.0057754\n}}</ref>{{,}}<ref name=\"ref-1\">{{Article|nom1= Germonpr\u00e9 |pr\u00e9nom1= M.\n |nom2= Sablin |pr\u00e9nom2= M.V.\n |nom3= Stevens |pr\u00e9nom3= R.E.\n |nom4= Hedges |pr\u00e9nom4= R.E.M.\n |nom5= Hofreiter |pr\u00e9nom5= M.\n |nom6= Stiller |pr\u00e9nom6= M.\n |nom7= Jaenicke-Desprese |pr\u00e9nom7= V.\n |titre= Fossil dogs and wolves from Palaeolithic sites in Belgium, the Ukraine and Russia: osteometry, ancient DNA and stable isotopes\n |p\u00e9riodique= [[Journal of Archaeological Science]]\n |ann\u00e9e= 2009 |volume= 36 |num\u00e9ro= 2\n |pages= 473-490\n}}</ref> ou de {{unit\u00e9|12000|ans}}<ref>{{Article|auteur=Morgane Kergoat|titre=La domestication du chien n'est pas aussi ancienne que ce que l'on pensait|p\u00e9riodique=[[Sciences et Avenir]].fr|date=24 fev. 2015|url=http://www.sciencesetavenir.fr/animaux/20150223.OBS3197/la-domestication-du-chien-n-est-pas-aussi-ancienne-que-ce-que-l-on-pensait.html}}.</ref>, donc ant\u00e9rieurs de plusieurs dizaines de milliers d'ann\u00e9es \u00e0 ceux de toute [[Domestication#Liste restreinte|autre esp\u00e8ce domestique]] connue. Depuis la [[Pr\u00e9histoire]], le chien a accompagn\u00e9 l'homme durant toute sa phase de [[s\u00e9dentarisation]], marqu\u00e9e par l'apparition des premi\u00e8res [[civilisation]]s agricoles. C'est \u00e0 ce moment qu'il a acquis la capacit\u00e9 de dig\u00e9rer l'[[amidon]]<ref>{{Article|lire en ligne= http://www.nature.com/nature/journal/vaop/ncurrent/full/nature11837.html\n |p\u00e9riodique=[[Nature (revue)|Nature]]\n |date=21 mars 2013|num\u00e9ro= 495\n |doi= 10.1038/nature11837\n |pages= 360-364\n |titre= The genomic signature of dog domestication reveals adaptation to a starch-rich diet\n |auteur1=Erik  Axelsson |auteur2=Abhirami Ratnakumar |auteur3=Maja-Louise Arendt |auteur4=Khurram  Maqbool |auteur5=Matthew T. Webster |auteur6=Michele Perloski |auteur7=Olof  Liberg |auteur8=Jon M. Arnemo |auteur9= \u00c5ke Hedhammar |auteur10= Kerstin Lindblad-Toh\n}}</ref>, et que ses fonctions d'auxiliaire de l'homme se sont \u00e9tendues. Ces nouvelles fonctions ont entrain\u00e9 une diff\u00e9renciation accrue de la [[sous-esp\u00e8ce]] et l'apparition progressive de [[Liste des races de chiens|races canines]] identifiables. Le chien est aujourd'hui utilis\u00e9 \u00e0 la fois comme animal de travail et comme [[animal de compagnie]]. Son [[instinct]] de [[Canis lupus#La meute : structure sociale du loup|meute]], sa domestication pr\u00e9coce et les caract\u00e9ristiques [[Comportement du chien|comportementales]] qui en d\u00e9coulent lui valent famili\u00e8rement le surnom de \u00ab meilleur ami de l'Homme \u00bb<ref>{{Lien web|titre = Si le chien est le meilleur ami de l'homme, c'est gr\u00e2ce \u00e0 une hormone|url = http://www.slate.fr/story/100495/chiens-yeux-ocytocine|consult\u00e9 le = 2015-06-08}}</ref>.\n\nCette place particuli\u00e8re dans la [[Soci\u00e9t\u00e9 (sociologie)|soci\u00e9t\u00e9 humaine]] a conduit \u00e0 l'\u00e9laboration d'une [[r\u00e8glementation]] sp\u00e9cifique. Ainsi, l\u00e0 o\u00f9 les crit\u00e8res de la [[F\u00e9d\u00e9ration cynologique internationale]] ont une reconnaissance l\u00e9gale, l'appellation ''chien de race'' est conditionn\u00e9e \u00e0 l'enregistrement du chien dans les livres des origines de son pays de naissance<ref>{{Lien web|url=http://laws.justice.gc.ca/fr/showdoc/cs/A-11.2//20090206/fr?command=search&caller=SI&search_type=all&shorttitle=g%C3%A9n%C3%A9alogie%20des%20animaux&day=6&month=2&year=2009&search_domain=cs&showall=L&statuteyear=all&lengthannual=50&length=50|titre=loi sur la g\u00e9n\u00e9alogie des animaux|site=Minist\u00e8re de l'agriculture du Canada}}</ref>{{,}}<ref name=\"ckc.ca\">{{Lien web|titre=Club Canin Canadien|url=http://www.ckc.ca}}</ref>. Selon le pays, des [[vaccin]]s peuvent \u00eatre obligatoires et certains types de chien, jug\u00e9s dangereux, sont soumis \u00e0 des restrictions. Le chien est g\u00e9n\u00e9ralement soumis aux diff\u00e9rentes l\u00e9gislations sur les [[carnivore domestique|carnivores domestiques]]. C'est notamment le cas en [[Europe]], o\u00f9 sa circulation est facilit\u00e9e gr\u00e2ce \u00e0 l'instauration du [[passeport europ\u00e9en pour animal de compagnie]].\n[[Fichier:Collage of Nine Dogs.jpg|vignette|upright=1.3|De gauche \u00e0 droite et de haut en bas, les photos de neuf chiens de race suivants :<br />- [[Labrador retriever]]<br />- [[Golden Retriever]]<br />- [[Cockapoo]]<br />- [[Yorkshire Terrier]]<br />- [[Boxer (chien)|Boxer]] femelle<br />- [[Spitz nain]] (Loulou de Pom\u00e9ranie)<br />- [[Beagle]]<br />- [[Basset Hound]]<br />- [[Terre-neuve (chien)|Terre-Neuve]]</center>]]\n{{Sommaire|niveau=2}}"
	//var restext = "{{semi-protection longue}}\n{{Redirect|Napol\u00e9on|Bonaparte}}\n{{Titre mis en forme|{{nobr|Napol\u00e9on {{Ier}}}}}}\n{{Infobox Personnalit\u00e9 politique\n | nom                           = {{nobr|Napol\u00e9on {{Ier}}}}\n | charte                        = Monarque\n | image                         = Jacques-Louis David - The Emperor Napoleon in His Study at the Tuileries - Google Art Project 2.jpg\n | l\u00e9gende                       = ''[[Napol\u00e9on dans son cabinet de travail]]'', [[Jacques-Louis David]], 1812.\n | dynastie                      = [[Famille Bonaparte|Maison Bonaparte]]\n | nom de naissance              = Napoleone Bonaparte <small>(sur l'acte de bapt\u00eame)</small>\n | date de naissance             = {{date de naissance|15|ao\u00fbt|1769}}\n | date de d\u00e9c\u00e8s                 = {{Date de d\u00e9c\u00e8s|5|mai|1821|15|ao\u00fbt|1769}}\n | lieu de naissance             = [[Ajaccio]] ([[Royaume de France|France]])\n | lieu de d\u00e9c\u00e8s                 = [[Sainte-H\u00e9l\u00e8ne (\u00eele)|\u00cele Sainte-H\u00e9l\u00e8ne]] ([[Royaume-Uni de Grande-Bretagne et d'Irlande|Royaume-Uni]])\n | nature du d\u00e9c\u00e8s               = \n | s\u00e9pulture                     = \n | nationalit\u00e9                   = \n | parti = \n| p\u00e8re                          = [[Charles Bonaparte]]\n | m\u00e8re                          = [[Maria Letizia Ramolino]]\n | fratrie                       = \n | conjoint                      = [[Jos\u00e9phine de Beauharnais]] <small>(1796-1809)</small><br />[[Marie-Louise d'Autriche]] <small>(1810-1821)</small>\n | enfants                       = [[Napol\u00e9on II|Napol\u00e9on Bonaparte]], ''prince imp\u00e9rial'', ''roi de Rome''\n | h\u00e9ritier                      = Prince [[Napol\u00e9on II|Napol\u00e9on]], ''prince imp\u00e9rial''\n | entourage                     = \n | profession                    = \n | religion                      = [[Catholicisme romain]]\n | r\u00e9sidence                     = \n | signature                     =Firma Napole\u00f3n Bonaparte.svg \n | embl\u00e8me                       = Imperial Coat of Arms of France (1804-1815).svg\n | embl\u00e8me2                      = Coat of Arms of the Kingdom of Italy (1805-1814).svg\n | liste                         = [[Liste des monarques de France|Monarques de France]]\u00b7[[Liste des rois d'Italie|Monarques d'Italie]]\n| fonction1                     = [[Liste des monarques de France|Empereur des Fran\u00e7ais]]\n | depuis le fonction1 = \n| \u00e0 partir du fonction1         = {{date|18|mai|1804}}\n | jusqu'au fonction1            = {{date|6|avril|1814}} <br /><small>({{Dur\u00e9e|18|5|1804|6|4|1814}})</small>\n | couronnement 1                = {{date|2|d\u00e9cembre|1804}},<br /> en la [[cath\u00e9drale Notre-Dame de Paris]]\n | pr\u00e9d\u00e9cesseur 1                = ''Lui-m\u00eame'' <small>([[Consulat (histoire de France)|Premier consul de la R\u00e9publique]])</small>\n | successeur 1                  = {{monarque|Louis|XVIII|de France|pays=non}} <small>(roi de France)</small>\n | \u00e0 partir du fonction2         = {{date|20|mars|1815-}}\n | jusqu'au fonction2            = {{date|22|juin|1815}}<br /><small>({{Dur\u00e9e|20|3|1815|22|6|1815}})</small>\n | pr\u00e9d\u00e9cesseur 2                = {{monarque|Louis|XVIII|de France|pays=non}} <small>(roi de France)</small>\n | successeur 2                  = {{monarque|Napol\u00e9on|II}} <small>(pr\u00e9tendant)</small><br />[[Louis XVIII|{{nobr|Louis {{XVIII}}}}]] <small>(roi de France)</small>\n | fonction3                     = [[Liste des rois d'Italie|Roi d'Italie]]\n | \u00e0 partir du fonction3         = {{date|17|mars|1805}}\n | jusqu'au fonction3            = {{date|11|avril|1814}} <br /><small>({{Dur\u00e9e|17|3|1805|11|4|1814}})</small>\n | pr\u00e9d\u00e9cesseur 3                = ''Lui-m\u00eame'' <small>(pr\u00e9sident de la R\u00e9publique italienne)</small>\n | successeur 3                  = {{monarque|Victor-Emmanuel|II|d'Italie|pays=non}} <br /><small>(roi d'Italie en 1861)</small>\n | fonction4                     = [[Liste des souverains de Germanie|Protecteur de la Conf\u00e9d\u00e9ration du Rhin]]\n | \u00e0 partir du fonction4         = {{date|12|juillet|1806}}\n | jusqu'au fonction4            = {{date|19|octobre|1813}} <br /><small>({{Dur\u00e9e|12|7|1806|19|10|1813}})</small>\n | pr\u00e9d\u00e9cesseur 4                = [[Fran\u00e7ois Ier d'Autriche|{{nobr|Fran\u00e7ois {{II}}}}]] <br /><small>(empereur romain germanique)''</small>\n | successeur 4                  = [[Conf\u00e9d\u00e9ration germanique]]\n | fonction5                     = [[Acte de M\u00e9diation|M\u00e9diateur de la Conf\u00e9d\u00e9ration suisse]]\n | \u00e0 partir du fonction5         = {{date|19|f\u00e9vrier|1803}}\n | jusqu'au fonction5            = {{date|19|octobre|1813}} <br /><small>({{Dur\u00e9e|19|2|1803|19|10|1813}})</small>\n | pr\u00e9d\u00e9cesseur 5                = [[R\u00e9publique helv\u00e9tique]]\n | successeur 5                  = [[Conf\u00e9d\u00e9ration des XXII cantons|Conf\u00e9d\u00e9ration des {{nobr|{{XXII}} cantons}}]]\n | fonction6                     = [[R\u00e9publique italienne (1802-1805)|Pr\u00e9sident de la R\u00e9publique italienne]]<br />''Napol\u00e9on Bonaparte''\n | \u00e0 partir du fonction6         = {{date|26|janvier|1802}}\n | jusqu'au fonction6            = {{date|17|mars|1805}} <br /><small>({{Dur\u00e9e|26|1|1802|17|3|1805}})</small>\n | vice-pr\u00e9sident 6              = [[Francesco Melzi d'Eril]]\n | pr\u00e9d\u00e9cesseur 6                = [[R\u00e9publique cisalpine]]\n | successeur 6                  = ''Lui-m\u00eame'' <small>(roi d'Italie)</small>\n | fonction7                     = [[Consulat (histoire de France)|Premier consul de la R\u00e9publique]]<br />''Napol\u00e9on Bonaparte''\n | \u00e0 partir du fonction7         = {{date|10|novembre|1799}}\n | jusqu'au fonction7            = {{date|18|mai|1804}} <br /><small>({{Dur\u00e9e|10|11|1799|18|04|1804}})</small>\n | pr\u00e9d\u00e9cesseur 7                = [[Directoire]]\n | successeur 7                  = ''Lui-m\u00eame'' <small>(empereur des Fran\u00e7ais)</small>\n }}\n\n'''{{nobr|Napol\u00e9on {{Ier}}}}''', n\u00e9 le {{date de naissance-|15|ao\u00fbt|1769}} \u00e0 [[Ajaccio]], et mort le {{Date de d\u00e9c\u00e8s-|5|mai|1821}} sur l'[[Sainte-H\u00e9l\u00e8ne (\u00eele)|\u00eele Sainte-H\u00e9l\u00e8ne]], est le premier [[Premier Empire|empereur des Fran\u00e7ais]], du {{date-|18|mai|1804}} au {{date-|6|avril|1814}} et du {{date-|20|mars|1815}} au {{date-|22|juin|1815}}. Second enfant de [[Charles Bonaparte]] et [[Letizia Bonaparte|Letitia Ramolino]], '''Napol\u00e9on Bonaparte''' est un militaire, [[g\u00e9n\u00e9ral]] dans les arm\u00e9es de la [[Premi\u00e8re R\u00e9publique (France)|Premi\u00e8re R\u00e9publique]] fran\u00e7aise, n\u00e9e de la [[R\u00e9volution fran\u00e7aise|R\u00e9volution]], commandant en chef de l'arm\u00e9e d'Italie puis de l'arm\u00e9e d'Orient. Parvenu au pouvoir en 1799, par le [[coup d'\u00c9tat du 18 brumaire]], il est [[Consulat (histoire de France)|Premier consul]] jusqu'au {{date-|2|ao\u00fbt|1802}}, puis consul \u00e0 vie jusqu'au {{date-|18|mai|1804}}, date \u00e0 laquelle il est proclam\u00e9 empereur par un [[s\u00e9natus-consulte]] suivi d'un [[pl\u00e9biscite]]. Il est sacr\u00e9 empereur, en la [[cath\u00e9drale Notre-Dame de Paris]], le {{date|2|d\u00e9cembre|1804}}, par le pape {{monarque|Pie|VII}}.\n\nEn tant que g\u00e9n\u00e9ral en chef et chef d'\u00c9tat, Napol\u00e9on tente de briser les [[Guerres napol\u00e9oniennes|coalitions]] mont\u00e9es et financ\u00e9es par le [[royaume de Grande-Bretagne]] et qui rassemblent, depuis 1792, les [[monarchie]]s [[Europe|europ\u00e9ennes]] contre la France et son r\u00e9gime n\u00e9 de la R\u00e9volution. Il conduit pour cela les arm\u00e9es fran\u00e7aises d'[[Campagne d'Italie (1796-1797)|Italie]] au [[Campagne d'\u00c9gypte|Nil]] et d'[[Campagne d'Allemagne (1805)|Autriche]] \u00e0 [[Campagne de Prusse et de Pologne|la Prusse et \u00e0 la Pologne]]: ses nombreuses et brillantes victoires ([[bataille du Pont d'Arcole|Arcole]], [[Bataille de Rivoli (1797)|Rivoli]], [[bataille des pyramides|Pyramides]], [[bataille de Marengo|Marengo]], [[bataille d'Austerlitz|Austerlitz]], [[bataille d'I\u00e9na|I\u00e9na]], [[bataille de Friedland|Friedland]]), dans des campagnes militaires rapides, disloquent les quatre premi\u00e8res coalitions. Les paix successives, qui mettent un terme \u00e0 chacune de ces coalitions, renforcent la France et donnent \u00e0 son chef, Napol\u00e9on, un degr\u00e9 de puissance jusqu'alors rarement \u00e9gal\u00e9 en Europe, lors de la [[Trait\u00e9 de Tilsit|paix de Tilsit]] (1807).\n\nIl r\u00e9organise et r\u00e9forme durablement l'\u00c9tat et la soci\u00e9t\u00e9. Il porte le territoire fran\u00e7ais \u00e0 son extension maximale avec 134 [[d\u00e9partement fran\u00e7ais|d\u00e9partements]] en 1812, transformant [[Rome]], [[Hambourg]], [[Barcelone]] ou [[Amsterdam]] en chefs-lieux de d\u00e9partements fran\u00e7ais. Il est aussi pr\u00e9sident de la [[R\u00e9publique cisalpine|R\u00e9publique italienne]] de 1802 \u00e0 1805, puis roi d\u2019[[Italie]] de 1805 \u00e0 1814, mais \u00e9galement m\u00e9diateur de la [[Conf\u00e9d\u00e9ration suisse]] de 1803 \u00e0 1813 et protecteur de la [[Conf\u00e9d\u00e9ration du Rhin]] de 1806 \u00e0 1813. Ses victoires lui permettent d'annexer \u00e0 la France de vastes territoires et de gouverner la majeure partie de l\u2019[[Europe continentale]] en pla\u00e7ant les membres de sa famille sur les tr\u00f4nes de plusieurs royaumes : [[Joseph Bonaparte|Joseph]] sur celui de [[Royaume de Naples|Naples]] puis d'[[Espagne]], [[Louis Bonaparte|Louis]] sur celui de [[Royaume de Hollande|Hollande]], [[J\u00e9r\u00f4me Bonaparte|J\u00e9r\u00f4me]] sur celui de [[Royaume de Westphalie|Westphalie]] et son beau-fr\u00e8re [[Joachim Murat]] \u00e0 Naples. Il cr\u00e9e \u00e9galement un [[duch\u00e9 de Varsovie]], sans oser restaurer formellement l'ind\u00e9pendance polonaise, et soumet temporairement \u00e0 son influence des puissances vaincues telles que le [[Royaume de Prusse]] et l'[[Empire d'Autriche]].\n\nObjet, d\u00e8s son vivant, d'[[L\u00e9gende napol\u00e9onienne|une l\u00e9gende dor\u00e9e]] comme d'[[L\u00e9gende noire#L\u00e9gende noire napol\u00e9onienne|une l\u00e9gende noire]], il doit sa tr\u00e8s grande notori\u00e9t\u00e9 \u00e0 son habilet\u00e9 militaire, r\u00e9compens\u00e9e par de nombreuses victoires, et \u00e0 sa trajectoire politique \u00e9tonnante<ref group=N>Issu de la petite noblesse corse, il est d'abord un fougueux r\u00e9publicain et jacobin, puis le chef de l\u2019un des \u00c9tats les plus puissants de l'\u00e9poque, et, mari\u00e9 \u00e0 une archiduchesse d'Autriche, fondateur d'une dynastie imp\u00e9riale.</ref>, mais aussi \u00e0 son r\u00e9gime [[Despotisme|despotique]] et tr\u00e8s centralis\u00e9 ainsi qu'\u00e0 son ambition qui se traduit par des guerres d'agression tr\u00e8s meurtri\u00e8res ([[Guerre d'ind\u00e9pendance espagnole|au Portugal, en Espagne]] et [[Campagne de Russie (1812)|en Russie]]) avec des [[Pertes humaines lors des guerres napol\u00e9oniennes|centaines de milliers de morts et bless\u00e9s, militaires et civils]] pour l'ensemble de l'Europe. Il tente \u00e9galement de renforcer le r\u00e9gime colonial fran\u00e7ais d'[[Ancien R\u00e9gime]] en outre-mer, en particulier avec le r\u00e9tablissement de l'esclavage en 1802, ce qui provoque la [[Exp\u00e9dition de Saint-Domingue|guerre de Saint-Domingue]] (1802-1803) et la perte d\u00e9finitive de cette colonie, tandis que les Britanniques s'assurent le contr\u00f4le de toutes les autres colonies entre 1803 et 1810. Cet ennemi britannique toujours invaincu s'obstinant \u00e0 financer des coalitions de plus en plus g\u00e9n\u00e9rales, les Alli\u00e9s finissent par remporter des succ\u00e8s d\u00e9cisifs en Espagne ([[bataille de Vitoria]]) et en Allemagne ([[Bataille de Leipzig (1813)|bataille de Leipzig]]) en 1813. L\u2019intransigeance de Napol\u00e9on devant ces sanglants revers lui fait perdre le soutien de pans entiers de la nation fran\u00e7aise<ref>T. Lentz, ''Nouvelle histoire du Premier Empire - L'effondrement du syst\u00e8me napol\u00e9onien (1810-1814)'', Fayard, 2004, {{t.|2}}, {{p.|361-363}}, \u00ab Lutter contre le d\u00e9couragement \u00bb.</ref>, tandis que ses anciens alli\u00e9s ou vassaux se retournent contre lui. Amen\u00e9 \u00e0 abdiquer en 1814 apr\u00e8s la [[Bataille de Paris (1814)|prise de Paris]], capitale de l'Empire fran\u00e7ais, et \u00e0 se retirer \u00e0 l'[[\u00eele d'Elbe]], il tente de reprendre le pouvoir en France, lors de l'\u00e9pisode des [[Cent-Jours]] en 1815. Capable de reconqu\u00e9rir son Empire sans coup f\u00e9rir, il am\u00e8ne pourtant la France dans une impasse devant sa mise au ban de l'Europe, avec la lourde [[Bataille de Waterloo|d\u00e9faite de Waterloo]] qui met fin \u00e0 l'Empire napol\u00e9onien et assure la [[Seconde Restauration|restauration de la dynastie des Bourbons]]. Sa [[Mort de Napol\u00e9on|mort en exil]], \u00e0 Sainte-H\u00e9l\u00e8ne, sous la garde des Anglais, fait l'objet de nombreuses controverses.\n\nUne tradition [[Romantisme|romantique]] fait de Napol\u00e9on l'arch\u00e9type du ''grand homme'' appel\u00e9 \u00e0 bouleverser le monde. C'est ainsi que le [[Emmanuel de Las Cases|comte de Las Cases]], auteur du ''[[Le M\u00e9morial de Sainte-H\u00e9l\u00e8ne|M\u00e9morial de Sainte-H\u00e9l\u00e8ne]]'', tente de pr\u00e9senter Napol\u00e9on au Parlement britannique dans une p\u00e9tition r\u00e9dig\u00e9e en 1818<ref>Voir notamment {{Lien web|url=http://www.lautresaintehelene.com/autre-sainte-helene-articles-qui-est-napoleon.html|titre=Albert Benhamou ''Qui \u00e9tait Napol\u00e9on ???''|site=www.lautresaintehelene.com|consult\u00e9 le=04 juillet 2016}}.</ref>. [[\u00c9lie Faure]], dans son ouvrage ''Napol\u00e9on'', qui a inspir\u00e9 [[Abel Gance]], le compare \u00e0 un \u00ab proph\u00e8te des temps modernes \u00bb. D'autres auteurs, tel [[Victor Hugo]], font du vaincu de Sainte-H\u00e9l\u00e8ne le \u00ab [[Prom\u00e9th\u00e9e]] moderne \u00bb. L'ombre de \u00ab Napol\u00e9on le Grand \u00bb plane sur de nombreux ouvrages de [[Honor\u00e9 de Balzac|Balzac]], [[Stendhal]], [[Alfred de Musset|Musset]], mais aussi de [[Dosto\u00efevski]], de [[L\u00e9on Tolsto\u00ef|Tolsto\u00ef]] et de bien d'autres encore. Par ailleurs, un courant politique fran\u00e7ais \u00e9merge au {{s-|XIX|e}}, le [[bonapartisme]], se revendiquant de l'action et du mode de gouvernement de Napol\u00e9on."
	//var restext = "[[File:Passirac Epitaphe XIXe versifi\u00e9e 2013.jpg|right|thumb|upright=1.5|\u00c9pitaphe du {{s-|XIX}}, versifi\u00e9e, dans un cimeti\u00e8re de Charente.]]\nUne '''\u00e9pitaphe ''' (du grec \u1f10\u03c0\u03b9\u03c4\u03ac\u03c6\u03bf\u03c2 / ''epi'', \u00ab\u00a0sur\u00a0\u00bb et ''taphos'', \u00ab tombeau \u00bb, par exemple des jeux fun\u00e8bres ou une oraison fun\u00e8bre) est une [[\u00e9pigraphie|inscription]] fun\u00e9raire, plac\u00e9e sur une [[pierre tombale]] ou un monument fun\u00e9raire. Cela peut \u00eatre un objet donn\u00e9 \u00e0 une civilisation comme signe de paix.\n\nDans la [[Gr\u00e8ce antique]], l\u2019\u00e9pitaphe est un [[genre litt\u00e9raire]] : c\u2019est un [[\u00e9loge fun\u00e8bre]] ancien.\n\nEn litt\u00e9rature fran\u00e7aise, l'\u00e9pitaphe est aussi un genre litt\u00e9raire rim\u00e9 : c'est surtout ce que l'on aimerait inscrire sur la pierre tombale de quelqu'un que l'on admire, ou, au contraire, que l'on n'appr\u00e9cie gu\u00e8re. Suppos\u00e9e \u00eatre inscrite sur le tombeau lui-m\u00eame, une \u00e9pitaphe peut d\u00e9buter par ''ci-g\u00eet'' ou par la formule plus moderne ''ici repose'' ou par leur pluriel ''ci-gisent'' et ''ici reposent''."
	//var restext = "{{Voir homonymes|Politique (homonymie)}}\n\nNotion [[Polys\u00e9mie|polys\u00e9mique]], la '''politique''' recouvre :\n\n* la politique en son sens plus large, celui de civilit\u00e9 ou ''Politikos'', indique le cadre g\u00e9n\u00e9ral dans lequel une soci\u00e9t\u00e9 ou une population est g\u00e9r\u00e9e par son (ses) dirigeant(s);\n* en g\u00e9n\u00e9ral, la politique d'une [[communaut\u00e9]], d'une [[Soci\u00e9t\u00e9 (sciences sociales)|soci\u00e9t\u00e9]], d'un [[groupe social]], au sens de ''Politeia'', ob\u00e9it \u00e0 une ''[[constitution]]'' r\u00e9dig\u00e9e par ses fondateurs qui d\u00e9finit sa structure et son fonctionnement (m\u00e9thodique, th\u00e9orique et pratique). La politique porte sur les actions, l\u2019\u00e9quilibre, le d\u00e9veloppement interne ou externe de cette soci\u00e9t\u00e9, ses rapports internes et ses rapports \u00e0 d'autres ensembles. La politique est donc principalement ce qui a trait au collectif, \u00e0 une somme d'individualit\u00e9s et/ou de multiplicit\u00e9s. C'est dans cette optique que les [[\u00e9tudes politiques]] ou la [[science politique]] s'\u00e9largissent \u00e0 tous les domaines d'une soci\u00e9t\u00e9 ([[\u00e9conomie (discipline)|\u00e9conomie]], [[droit]], [[sociologie]], etc.) ;\n* dans une acception plus restrictive, la politique au sens de ''Politik\u00e8'' ou d'art politique, se r\u00e9f\u00e8re \u00e0 la pratique du [[Pouvoir politique|pouvoir]], soit donc aux luttes de pouvoir et de repr\u00e9sentativit\u00e9 entre des hommes et femmes de pouvoir, et aux diff\u00e9rents [[partis politiques]] auxquels ils peuvent appartenir, tout comme \u00e0 la gestion de ce m\u00eame pouvoir ;\n* la politique est le plus souvent assortie d'une \u00e9pith\u00e8te qui d\u00e9termine sa d\u00e9finition : on va parler de strat\u00e9gie politique<ref>{{Ouvrage|langue = Fran\u00e7ais|auteur1 = Guy Sallat|titre = D\u00e9cider en strat\u00e8ge: la voie de la performance|lieu = Paris|\u00e9diteur = Lharmattan|ann\u00e9e = 2013|pages totales = 243|isbn = |lire en ligne = |passage = }}</ref> par exemple pour expliquer comment elle se situe dans une perception combinatoire et planifi\u00e9e de nature \u00e0 lui faire atteindre ses objectifs."
	var restext = "{{Semi-protection}}\n{{Voir homonymes|Macron}}\n{{Infobox Personnalit\u00e9 politique\n | charte                = Chef d'\u00c9tat\n | image                 = Emmanuel Macron in Tallinn Digital Summit. Welcome dinner hosted by HE Donald Tusk. Handshake (36669381364) (cropped 2).jpg\n | l\u00e9gende               = Emmanuel Macron en 2017.\n | fonction1             = [[Pr\u00e9sident de la R\u00e9publique fran\u00e7aise]]\n | depuis le fonction1   = {{date|14 mai 2017}}<br/><small>({{dur\u00e9e|14|5|2017}})</small>\n | \u00e0 partir du fonction1 =\n | jusqu'au fonction1    = \n | \u00e9lection1             = [[\u00c9lection pr\u00e9sidentielle fran\u00e7aise de 2017|7 mai 2017]]\n | premier ministre 1    = [[\u00c9douard Philippe]]\n | pr\u00e9d\u00e9cesseur 1        = [[Fran\u00e7ois Hollande]]\n | fonction2             = Pr\u00e9sident d'[[La R\u00e9publique en marche !|En marche !]]\n | \u00e0 partir du fonction2 = {{date|6 avril 2016}}\n | jusqu'au fonction2    = {{date|8 mai 2017}}<br/><small>({{dur\u00e9e|6|4|2016|8|5|2017}})</small>\n | pr\u00e9d\u00e9cesseur 2        = ''Parti cr\u00e9\u00e9''\n | successeur 2          = [[Catherine Barbaroux]] <small>(int\u00e9rim, La R\u00e9publique en marche !)</small>\n | fonction3             = [[Minist\u00e8re de l'\u00c9conomie et des Finances (France)|Ministre de l'\u00c9conomie]], [[Liste des ministres fran\u00e7ais de l'Industrie|de l'Industrie]]<br/>et [[Liste des ministres fran\u00e7ais de l'\u00c9conomie num\u00e9rique|du Num\u00e9rique]]\n | \u00e0 partir du fonction3 = {{date|26 ao\u00fbt 2014}}\n | jusqu'au fonction3    = {{date|30 ao\u00fbt 2016}}<br/><small>({{dur\u00e9e|26|08|2014|30|08|2016}})</small>\n | pr\u00e9sident 3           = [[Fran\u00e7ois Hollande]]\n | premier ministre 3    = [[Manuel Valls]]\n | gouvernement 3        = [[Gouvernement Manuel Valls (2)|Valls II]]\n | pr\u00e9d\u00e9cesseur 3        = [[Arnaud Montebourg]] <small>(\u00c9conomie, Finances, Redressement productif et \u00c9conomie num\u00e9rique)</small>\n | successeur 3          = [[Michel Sapin]]<ref group=alpha>[[Christophe Sirugue]] devient secr\u00e9taire d'\u00c9tat \u00e0 l'Industrie sous la direction de Michel Sapin.</ref> <small>(ministre de l'\u00c9conomie et des Finances)</small>\n | fonction4             = Secr\u00e9taire g\u00e9n\u00e9ral adjoint du [[cabinet du pr\u00e9sident de la R\u00e9publique fran\u00e7aise]]<ref group=alpha>Charg\u00e9 du p\u00f4le de l'\u00e9conomie et de la finance.</ref>\n | \u00e0 partir du fonction4 = {{date|15 mai 2012}}\n | jusqu'au fonction4    = {{date|15 juillet 2014}}<br/><small>({{dur\u00e9e|15|05|2012|15|07|2014}})</small>\n | pr\u00e9sident 4           = [[Fran\u00e7ois Hollande]]\n | pr\u00e9d\u00e9cesseur 4        = [[Jean Castex (homme politique)|Jean Castex]]\n | successeur 4          = [[Laurence Boone]]\n | nom de naissance      = Emmanuel Jean-Michel Fr\u00e9d\u00e9ric Macron\n | date de naissance     = {{date de naissance|21 d\u00e9cembre 1977|\u00e2ge=oui}}\n | lieu de naissance     = [[Amiens]] ([[Somme (d\u00e9partement)|Somme]], [[France]])\n | nationalit\u00e9           = [[France|fran\u00e7aise]]\n | signature             = Emmanuel Macron signature.svg\n | parti                 = [[Parti socialiste (France)|PS]] <small>(2006-2009)</small><br/>[[Sans \u00e9tiquette|SE]] <small>(2009-2016)</small><br/>[[La R\u00e9publique en marche !|EM/REM]] <small>(depuis 2016)</small>\n | universit\u00e9            = [[universit\u00e9 Paris-Nanterre]]<br/>[[Institut d'\u00e9tudes politiques de Paris|IEP de Paris]]<br/>[[\u00c9cole nationale d'administration (France)|ENA]]\n | profession            = [[Haut fonctionnaire en France|haut fonctionnaire]]<br/>[[banquier d'affaires]]\n | religion              = [[catholicisme]]<ref name=\"lavie\">{{Article|langue=fr-FR|titre=Foi, la\u00efcit\u00e9, Europe : Emmanuel Macron en 7 extraits|p\u00e9riodique=lavie.fr|date=2016-12-15|lire en ligne=http://www.lavie.fr/dossiers/invites-politique-de-la-redaction/foi-laicite-europe-emmanuel-macron-en-7-extraits-15-12-2016-78648_807.php|consult\u00e9 le=2017-05-08}}.</ref>\n | r\u00e9sidence             = [[palais de l'\u00c9lys\u00e9e]], [[Paris]] ([[8e arrondissement de Paris|VIII{{e}}]])\n | site web              = {{url|https://en-marche.fr/emmanuel-macron}}\n | conjoint              = [[Brigitte Macron|Brigitte Trogneux]] <small>(mari\u00e9s en 2007)</small>\n | embl\u00e8me               = Armoiries r\u00e9publique fran\u00e7aise.svg\n | liste                 = [[Liste des pr\u00e9sidents de la R\u00e9publique fran\u00e7aise|Pr\u00e9sidents de la R\u00e9publique fran\u00e7aise]]\n}}\n\n'''Emmanuel Macron''', n\u00e9 le {{date de naissance|21 d\u00e9cembre 1977}} \u00e0 [[Amiens]], est un [[homme d'\u00c9tat]] [[France|fran\u00e7ais]]. Il est [[pr\u00e9sident de la R\u00e9publique fran\u00e7aise]] depuis le {{date|14|mai|2017}}.\n\nApr\u00e8s des \u00e9tudes en [[philosophie]] et en [[science politique]] \u00e0 l'[[universit\u00e9 Paris-Nanterre]], il est dipl\u00f4m\u00e9 de l'[[Institut d'\u00e9tudes politiques de Paris|IEP de Paris]] et de l'[[\u00c9cole nationale d'administration (France)|ENA]], dont il sort [[Inspection g\u00e9n\u00e9rale des finances (France)|inspecteur des finances]]. En 2008, il rejoint la [[banque d'affaires]] [[Rothschild & Cie|Rothschild & {{Cie}}]], dont il devient deux ans plus tard [[Associ\u00e9|associ\u00e9-g\u00e9rant]].\n\nMembre du [[Parti socialiste (France)|Parti socialiste]] entre 2006 et 2009, il est nomm\u00e9 en 2012 secr\u00e9taire g\u00e9n\u00e9ral adjoint au [[cabinet du pr\u00e9sident de la R\u00e9publique fran\u00e7aise|cabinet du pr\u00e9sident de la R\u00e9publique]], [[Fran\u00e7ois Hollande]], puis [[Liste des ministres fran\u00e7ais de l'\u00c9conomie nationale|ministre de l'\u00c9conomie]], [[Liste des ministres fran\u00e7ais de l'Industrie|de l'Industrie]] et [[Liste des ministres fran\u00e7ais de l'\u00c9conomie num\u00e9rique|du Num\u00e9rique]] en 2014, alors qu'il est encore inconnu du grand public.\n\nEn {{date-|avril 2016}}, il fonde son propre parti politique, baptis\u00e9 [[La R\u00e9publique en marche !|En marche !]], et d\u00e9missionne quatre mois plus tard du [[Gouvernement Manuel Valls (2)|deuxi\u00e8me gouvernement Manuel Valls]]. Il adopte un positionnement hostile au [[Gauche et droite en politique|clivage gauche-droite]] et se pr\u00e9sente \u00e0 l'[[\u00c9lection pr\u00e9sidentielle fran\u00e7aise de 2017|\u00e9lection pr\u00e9sidentielle de 2017]]. Arriv\u00e9 en t\u00eate du premier tour avec 24,01 % des voix, il remporte le second, avec 66,10 % des suffrages exprim\u00e9s, face \u00e0 la candidate [[Front national (parti fran\u00e7ais)|Front national]], [[Marine Le Pen]].\n\nLors de son entr\u00e9e en fonction, il est, \u00e0 {{nombre|39|ans}}, le plus jeune pr\u00e9sident fran\u00e7ais de l'histoire<ref group=alpha>Devant [[Napol\u00e9on III|Louis-Napol\u00e9on Bonaparte]] \u00e9lu \u00e0 {{nombre|40|ans}} en 1848. Il est aussi le plus jeune chef d'\u00c9tat fran\u00e7ais depuis la d\u00e9signation en 1799 de [[Napol\u00e9on Ier|Napol\u00e9on Bonaparte]] comme Premier consul \u00e0 {{nombre|30|ans}}.</ref>, le plus jeune dirigeant du [[Groupe des vingt|G20]] et le plus jeune chef d\u2019\u00c9tat \u00e9lu [[d\u00e9mocratie|d\u00e9mocratiquement]], exception faite du [[micro-\u00c9tat]] de [[Saint-Marin]]{{note|groupe=alpha|texte=Et le cinqui\u00e8me plus jeune dans le monde, derri\u00e8re la capitaine-r\u00e9gente de Saint-Marin [[Vanessa D'Ambrosio]] ({{nobr|29 ans}}), le dictateur nord-cor\u00e9en [[Kim Jong-un]] ({{nobr|34 ans}}), l'\u00e9mir du Qatar [[Tamim ben Hamad Al Thani]] ({{nobr|36 ans}}), le roi du Bhoutan [[Jigme Khesar Namgyel Wangchuck]] ({{nobr|37 ans}})<ref>{{Article|langue=fr|pr\u00e9nom1=Anne-A\u00ebl Durand, El\u00e9a Pommiers et Maxime|nom1=Delrue|titre=\u00c9lu pr\u00e9sident \u00e0 l\u2019\u00e2ge de 39 ans, Emmanuel Macron sera le plus jeune chef d\u2019\u00c9tat en fonction dans une d\u00e9mocratie|p\u00e9riodique=Le Monde.fr|date=2017-05-07|issn=1950-6244|lire en ligne=http://www.lemonde.fr/les-decodeurs/article/2017/05/07/emmanuel-macron-est-le-plus-jeune-chef-d-etat-elu-d-une-democratie_5123799_4355770.html|consult\u00e9 le=2017-05-08}}</ref>{{,}}<ref>{{Lien web|titre=Seuls trois chefs d\u2019\u00c9tat sont plus jeunes que Macron: devinez lesquels|url=http://www.huffingtonpost.fr/2017/05/07/age-de-39-ans-emmanuel-macron-est-le-plus-jeune-president-de-fr_a_22074230/|site=Le Huffington Post|consult\u00e9 le=2017-05-08}}</ref> et le pr\u00e9sident du Conseil politique supr\u00eame du Y\u00e9men [[Saleh Ali al-Sammad]] ({{nobr|38 ans}}).}}. Son parti obtient la majorit\u00e9 absolue \u00e0 l'Assembl\u00e9e nationale \u00e0 l'issue des [[\u00c9lections l\u00e9gislatives fran\u00e7aises de 2017|\u00e9lections l\u00e9gislatives de juin 2017]]. \n\n{{Sommaire|niveau=4}}"
	var word = $('#word').val()

	$.get(queryUrl+word, function(data, status){
		console.log(data)
	})
	
	$('#base').html(browserify(restext))
	$('#test').html(browserify(extractText(restext)))
	$('#sentence').html(browserify(getSentence(restext)))
}