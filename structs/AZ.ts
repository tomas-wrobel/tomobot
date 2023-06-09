import {
	ActionRowBuilder,
	AttachmentBuilder,
	StringSelectMenuInteraction,
	ChatInputCommandInteraction,
	ComponentType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	User,
} from "discord.js";
import sharp from "sharp";

class AZHex {
	public color = "white";

	constructor(public d: string, public x: number, public y: number) {}
}

class AZ {
	constructor(private interaction: ChatInputCommandInteraction) {
		this.players = [
			interaction.user,
			interaction.options.getUser("user", true),
		];
	}

	async start() {
		const reply = await this.update();

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
		});

		collector.on("collect", async interaction => {
			if (interaction.user.id !== this.players[this.player].id) {
				await interaction.reply({
					content: "It's not your turn!",
					ephemeral: true,
				});
			} else {
				await this.ask(interaction, parseInt(interaction.values[0]));
			}
		});
	}

	player = 0;

	async update() {
		const buffer = await sharp(Buffer.from(this.toSVG())).png().toBuffer();

		return await this.interaction[this.interaction.replied ? "editReply" : "reply"]({
			content: "",
			files: [new AttachmentBuilder(buffer, {name: "az.png"})],
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.addOptions(
							this.items
								.filter(a => a.color === "white")
								.map((item, i) =>
									new StringSelectMenuOptionBuilder()
										.setLabel(`Ask - ${i + 1}`)
										.setValue(`${i + 1}`)
								)
								.slice(0, 25)
						)
						.setCustomId("az")
						.setMaxValues(1)
						.setMinValues(1)
						.setPlaceholder("Select a hexagon")
				),
			],
		});
	}

	next() {
		this.player = (this.player + 1) % 2;
	}

	async ask(interaction: StringSelectMenuInteraction, n: number) {
		if (interaction.replied) {
			await interaction.editReply("⏳ Loading...").catch(console.error);
		} else {
			await interaction.reply("⏳ Loading...").catch(console.error);
		}

		const player = this.players[this.player];
		const [quiz] = await fetch(
			"https://the-trivia-api.com/v2/questions/?limit=1"
		).then(res => res.json());

		const reply = await interaction.editReply({
			content: `@${player.username}#${player.tag}, **${quiz.question.text}**`,
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.addOptions(
							[...quiz.incorrectAnswers, quiz.correctAnswer].map(string => 
								new StringSelectMenuOptionBuilder()
									.setLabel(string)
									.setValue(string)
							)
						)
						.setCustomId("az-question")
						.setMaxValues(1)
						.setMinValues(1)
						.setPlaceholder("Select an answer")
				),
			],
		});

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
		});

		collector.on("collect", async interaction => {
			if (interaction.user.id !== this.players[this.player].id) {
				return;
			}

			await interaction.reply("⏳ Loading...").catch(console.error);

			if (interaction.values[0] === quiz.correctAnswer) {
				await interaction.followUp("✅ **Correct**");
				this.set(n, this.player === 0 ? "orange" : "blue");
			} else {
				await interaction.followUp(
					"❌ **Wrong!**. The correct answer was **" +
						quiz.correctAnswer +
						"**"
				);
				this.set(n, "black");
			}

			await this.update();
			this.next();
		});
	}

	players: User[];
	items = [
		new AZHex(
			"m 177.55408,48.438744 -10.80115,-6.181082 -0.0219,-13.355988 -0.0219,-13.355989 11.22865,-6.4482502 11.22864,-6.4482502 11.29353,6.5108932 11.29354,6.5108932 -0.15463,13.257926 -0.15464,13.257926 -10.6787,6.20069 c -5.87328,3.410379 -11.06832,6.207805 -11.54454,6.216501 -0.47621,0.0087 -5.72635,-2.765675 -11.66698,-6.16527 z",
			189.23131561279297,
			28.626607418060303
		),
		new AZHex(
			"M 204.37327,95.520484 193.26165,89.077548 V 75.991942 62.906335 l 11.17039,-6.428054 c 6.14372,-3.53543 11.35319,-6.428054 11.57661,-6.428054 0.22342,0 5.45695,2.911826 11.63007,6.470725 l 11.22386,6.470726 V 76.00935 89.027022 l -11.2469,6.486816 c -6.1858,3.56775 -11.44578,6.478442 -11.68885,6.468202 -0.24307,-0.0102 -5.44217,-2.917941 -11.55356,-6.461556 z",
			216.0621109008789,
			76.01614761352539
		),
		new AZHex(
			"m 150.54686,95.943444 -11.25593,-6.517427 -0.13845,-13.194092 -0.13845,-13.194091 11.04408,-6.301395 c 6.07425,-3.465767 11.35344,-6.301394 11.73155,-6.301394 0.3781,0 5.65965,2.835627 11.73677,6.301394 l 11.04931,6.301395 -0.13055,13.197259 -0.13056,13.197259 -10.67869,6.152329 c -5.87329,3.383781 -10.93846,6.315199 -11.25593,6.514259 -0.31748,0.19906 -5.64239,-2.570912 -11.83315,-6.155496 z",
			161.7948989868164,
			76.27203750610352
		),
		new AZHex(
			"m 123.00332,143.36194 -11.09256,-6.43905 -0.008,-13.27622 -0.008,-13.27622 11.28759,-6.48775 11.28758,-6.487752 11.20104,6.487752 11.20103,6.48775 0.005,13.27622 0.005,13.27622 -11.0436,6.34949 c -6.07398,3.49223 -11.20051,6.3898 -11.39228,6.43906 -0.19177,0.0493 -5.34033,-2.80802 -11.44124,-6.3495 z",
			134.38837814331055,
			123.55349349975586
		),
		new AZHex(
			"m 176.95499,142.87063 -10.82301,-6.34773 v -13.17621 -13.17622 l 10.99405,-6.39382 c 6.04672,-3.51659 11.22,-6.393811 11.49617,-6.393811 0.27617,0 5.45918,2.878291 11.51781,6.396201 l 11.01568,6.39619 v 13.17225 13.17224 l -11.04901,6.40677 c -6.07695,3.52373 -11.33693,6.38092 -11.68884,6.34932 -0.35192,-0.0316 -5.5102,-2.91393 -11.46285,-6.40518 z",
			188.64382934570312,
			123.32944869995117
		),
		new AZHex(
			"m 231.20363,142.56789 -11.41094,-6.61717 0.15501,-13.02748 0.15501,-13.02748 11.3462,-6.53316 11.3462,-6.533157 11.30685,6.481887 11.30685,6.48189 -0.1412,13.27214 -0.1412,13.27214 -8.08118,4.64954 c -4.44464,2.55724 -9.50981,5.44794 -11.25592,6.42377 l -3.17475,1.77424 z",
			242.60076904296875,
			123.00724029541016
		),
		new AZHex(
			"m 257.91107,189.72344 -10.67869,-6.2505 -0.15474,-13.2333 -0.15474,-13.2333 11.32236,-6.51551 11.32237,-6.51551 1.87649,1.0916 c 1.03207,0.60038 6.19641,3.55924 11.47633,6.57526 l 9.59983,5.48365 0.0122,13.01069 0.0122,13.01068 -11.22386,6.47073 c -6.17312,3.5589 -11.56298,6.44491 -11.97746,6.41337 -0.41448,-0.0315 -5.55901,-2.87008 -11.4323,-6.30786 z",
			269.7337875366211,
			170.0034408569336
		),
		new AZHex(
			"m 204.19674,190.11194 -11.2237,-6.47125 V 170.3848 157.12891 l 9.23563,-5.35961 c 5.0796,-2.94779 10.15465,-5.84788 11.27789,-6.44466 l 2.04226,-1.08505 11.23396,6.50536 11.23396,6.50536 v 13.13487 13.13487 l -8.94701,5.17732 c -4.92086,2.84753 -10.00053,5.78673 -11.28816,6.53157 l -2.34113,1.35424 z",
			215.4849090576172,
			170.41138458251953
		),
		new AZHex(
			"m 149.53671,190.23745 -11.11162,-6.40296 v -13.07684 -13.07684 l 11.32676,-6.53928 c 8.48886,-4.90087 11.57849,-6.41663 12.33143,-6.04976 0.55257,0.26924 5.71573,3.20923 11.4737,6.53331 l 10.46904,6.04379 v 13.08447 13.08447 l -11.16906,6.41404 c -6.14299,3.52771 -11.40297,6.4083 -11.68885,6.40129 -0.28588,-0.007 -5.52001,-2.89406 -11.6314,-6.41569 z",
			161.2255630493164,
			170.84632873535156
		),
		new AZHex(
			"m 95.702777,190.70341 -11.248411,-6.48549 v -13.17443 -13.17444 l 8.947018,-5.16439 c 4.92086,-2.84042 9.996486,-5.779 11.279166,-6.53019 l 2.33215,-1.36579 11.23269,6.48448 11.23268,6.48447 0.13753,13.23893 0.13752,13.23894 -8.79593,5.01352 c -4.83776,2.75743 -9.9682,5.66745 -11.40097,6.4667 l -2.60503,1.45318 z",
			107.10374450683594,
			170.99880981445312
		),
		new AZHex(
			"m 68.156231,238.02113 -11.103092,-6.43302 0.135779,-13.24452 0.13578,-13.24452 11.229963,-6.48643 c 6.176481,-3.56753 11.5014,-6.31697 11.833154,-6.10986 0.331754,0.20712 5.408604,3.15886 11.281888,6.55943 l 10.678697,6.18285 v 13.13166 13.13165 l -11.255924,6.53306 c -6.190759,3.59318 -11.385802,6.50598 -11.544539,6.47289 -0.158738,-0.0331 -5.285005,-2.95503 -11.391706,-6.49319 z",
			79.70077323913574,
			218.5031967163086
		),
		new AZHex(
			"m 122.11843,237.55456 -10.82301,-6.34657 v -13.16593 -13.16592 l 11.2979,-6.48802 11.2979,-6.48802 2.4376,1.37274 c 1.34069,0.75501 6.50774,3.71052 11.48235,6.56779 l 9.04474,5.19504 0.0202,13.01069 0.0202,13.01068 -11.22386,6.47073 c -6.17312,3.5589 -11.56298,6.44882 -11.97746,6.42204 -0.41448,-0.0268 -5.62395,-2.90463 -11.5766,-6.39525 z",
			134.09586715698242,
			217.92505645751953
		),
		new AZHex(
			"m 176.66638,237.53988 -11.11162,-6.3887 0.0195,-13.34637 0.0195,-13.34636 10.86252,-6.2052 c 5.97439,-3.41285 11.2256,-6.19724 11.66935,-6.18752 0.44375,0.01 5.61223,2.80657 11.48552,6.21522 l 10.6787,6.19755 0.1546,13.27137 0.15461,13.27137 -11.23903,6.48863 c -6.18146,3.56874 -11.3162,6.47289 -11.41053,6.45367 -0.0943,-0.0192 -5.17173,-2.90987 -11.28312,-6.42366 z",
			188.07691955566406,
			218.0146713256836
		),
		new AZHex(
			"m 230.62657,237.14778 -11.41077,-6.66366 0.15484,-12.97285 0.15484,-12.97284 2.88614,-1.69536 c 1.58737,-0.93245 6.69551,-3.89241 11.35141,-6.57768 l 8.46528,-4.88233 11.31504,6.53252 11.31504,6.53251 -0.1546,13.22704 -0.1546,13.22704 -9.81286,5.70219 c -5.39708,3.1362 -10.46224,6.04079 -11.25593,6.45463 -1.3516,0.70475 -2.16636,0.33006 -12.85383,-5.91121 z",
			242.03710174560547,
			217.34973907470703
		),
		new AZHex(
			"m 285.04074,236.82828 -11.25592,-6.5191 V 217.1782 204.04721 l 8.94702,-5.16439 c 4.92086,-2.84042 10.00052,-5.78137 11.28815,-6.53545 l 2.34113,-1.37106 11.2237,6.47085 11.2237,6.47084 0.1356,13.25783 0.1356,13.25783 -7.59863,4.3292 c -4.17925,2.38106 -9.30544,5.28665 -11.39153,6.45686 l -3.79289,2.12765 z",
			296.4322509765625,
			217.16184997558594
		),
		new AZHex(
			"m 312.072,284.14745 -11.15751,-6.44458 -0.1461,-13.24452 -0.1461,-13.24452 11.28473,-6.52521 11.28474,-6.5252 11.37321,6.56094 11.37322,6.56095 0.15494,13.01652 0.15494,13.01653 -11.50928,6.63683 -11.50928,6.63684 z",
			323.43519592285156,
			264.3777618408203
		),
		new AZHex(
			"m 257.4921,284.19954 -11.09768,-6.43327 0.13036,-13.24452 0.13037,-13.24452 11.22485,-6.48347 11.22485,-6.48348 2.33999,1.35881 c 1.28699,0.74734 6.36614,3.68992 11.287,6.53906 l 8.94701,5.18025 v 13.15125 13.15125 l -11.25592,6.51726 c -6.19076,3.5845 -11.38581,6.49643 -11.54454,6.47096 -0.15874,-0.0255 -5.28257,-2.94128 -11.38629,-6.47958 z",
			269.03662109375,
			264.4948196411133
		),
		new AZHex(
			"m 203.63262,284.72643 -11.23681,-6.50661 -0.1356,-13.21438 -0.1356,-13.21438 7.59864,-4.3292 c 4.17925,-2.38107 9.31068,-5.29001 11.40318,-6.46432 l 3.80454,-2.13511 11.24427,6.4831 11.24428,6.48311 v 13.17443 13.17444 l -8.94702,5.16439 c -4.92086,2.84042 -9.99463,5.77791 -11.27504,6.52777 l -2.32803,1.36337 z",
			214.77203369140625,
			265.04772186279297
		),
		new AZHex(
			"m 149.3924,284.80816 -11.25592,-6.50224 v -13.17444 -13.17443 l 8.94701,-5.16439 c 4.92086,-2.84042 9.98996,-5.77517 11.26466,-6.52168 l 2.31764,-1.35729 11.24719,6.47382 11.2472,6.47381 0.14421,13.24109 0.14422,13.24109 -11.06889,6.3495 c -6.08789,3.49222 -11.21796,6.40977 -11.40014,6.48345 -0.18219,0.0737 -5.39642,-2.79206 -11.58718,-6.36829 z",
			160.79254913330078,
			265.0458068847656
		),
		new AZHex(
			"m 94.700145,284.83254 -11.111619,-6.44413 0.0122,-13.01006 0.01221,-13.01007 9.599838,-5.48365 c 5.279911,-3.01601 10.440966,-5.97299 11.469006,-6.57107 l 1.86916,-1.08741 11.32967,6.51758 11.32968,6.51758 -0.15472,13.24513 -0.15473,13.24513 -10.8861,6.28977 c -5.98735,3.45937 -11.18239,6.27752 -11.54454,6.26255 -0.36214,-0.015 -5.65866,-2.92708 -11.770055,-6.47135 z",
			106.39941024780273,
			265.2650451660156
		),
		new AZHex(
			"m 41.018035,285.40977 -11.111619,-6.44413 0.0058,-13.29868 0.0058,-13.29868 10.890951,-6.20519 c 5.990023,-3.41285 11.214601,-6.20519 11.610173,-6.20519 0.395571,0 5.612457,2.79234 11.59308,6.20519 l 10.87386,6.20519 0.02199,13.28321 0.02199,13.28321 -11.246908,6.48682 c -6.1858,3.56775 -11.315905,6.47457 -11.400233,6.4596 -0.08433,-0.015 -5.153554,-2.92708 -11.264945,-6.47135 z",
			52.41823959350586,
			265.91954040527344
		),
		new AZHex(
			"m 13.321439,332.70467 -11.1013205,-6.45133 -0.010299,-13.07304 -0.010299,-13.07304 11.3755005,-6.60082 11.375499,-6.60083 11.28066,6.51837 11.280659,6.51836 0.135902,13.1555 0.135903,13.1555 -11.057167,6.3495 c -6.081441,3.49222 -11.33764,6.39532 -11.680442,6.45132 -0.342801,0.056 -5.61887,-2.80126 -11.724596,-6.34949 z",
			24.991581439971924,
			312.9803161621094
		),
		new AZHex(
			"m 67.961028,332.59344 -11.213557,-6.48188 -0.141201,-13.20533 -0.141201,-13.20533 11.34882,-6.50606 11.34882,-6.50607 9.283939,5.31616 c 5.106166,2.92389 10.262869,5.92288 11.459341,6.66443 l 2.175401,1.34827 -0.15511,13.02327 -0.1551,13.02327 -11.298299,6.50557 -11.298295,6.50557 z",
			79.27322578430176,
			312.8820495605469
		),
		new AZHex(
			"m 121.82238,332.12136 -11.11906,-6.44525 0.15175,-13.25092 0.15174,-13.25093 11.21394,-6.42037 11.21394,-6.42036 11.29791,6.51791 11.29791,6.51791 v 13.14788 13.14787 l -11.25592,6.49645 c -6.19076,3.57304 -11.38581,6.47588 -11.54454,6.45075 -0.15874,-0.0251 -5.29219,-2.94606 -11.40767,-6.49094 z",
			133.3669204711914,
			312.4730224609375
		),
		new AZHex(
			"m 176.4177,332.1126 -11.15156,-6.44672 -0.1474,-13.2711 -0.1474,-13.27111 11.29533,-6.5123 11.29533,-6.51229 11.21962,6.51054 11.21962,6.51054 -0.008,13.27798 -0.008,13.27797 -2.73351,1.51471 c -1.50343,0.83309 -6.54688,3.73181 -11.20767,6.4416 l -8.47416,4.92689 z",
			187.4862823486328,
			312.3291931152344
		),
		new AZHex(
			"m 230.34849,331.62788 -11.11162,-6.3887 0.022,-13.34637 0.022,-13.34637 10.87386,-6.20519 c 5.98063,-3.41285 11.23071,-6.19227 11.66686,-6.17648 0.43615,0.0158 5.59841,2.80813 11.4717,6.20519 l 10.6787,6.17648 0.15466,13.30375 0.15466,13.30375 -11.20153,6.46628 c -6.16084,3.55645 -11.2956,6.45054 -11.41058,6.43132 -0.11499,-0.0192 -5.20929,-2.90987 -11.32068,-6.42366 z",
			241.75909423828125,
			312.10813903808594
		),
		new AZHex(
			"m 284.30852,331.29787 -11.41093,-6.60037 0.155,-13.059 0.155,-13.05899 11.32637,-6.52445 11.32637,-6.52444 11.33689,6.50791 11.3369,6.50791 -0.15142,13.23709 -0.15141,13.23708 -8.08117,4.68199 c -4.44465,2.57509 -9.50982,5.47256 -11.25593,6.43881 l -3.17475,1.75683 z",
			295.71588134765625,
			311.7144470214844
		),
		new AZHex(
			"m 338.72285,330.9415 -11.25592,-6.54869 v -13.09068 -13.09067 l 11.34098,-6.55362 11.34098,-6.55362 11.17087,6.49092 11.17087,6.49093 0.13994,13.21779 0.13994,13.2178 -11.01189,6.34949 c -6.05654,3.49223 -11.18468,6.41015 -11.39587,6.48427 -0.21118,0.0741 -5.44914,-2.81214 -11.6399,-6.41392 z",
			350.11871337890625,
			311.2305603027344
		),
	];

	toSVG() {
		return `<svg viewBox="0 0 375.104 342.007" xmlns="http://www.w3.org/2000/svg">${this.items.reduce(
			(a, b, i) =>
				`${a}<path d="${b.d}" fill="${
					b.color
				}" stroke="#000" /><text x="${b.x}" y="${
					b.y
				}" font-family="sans-serif" dominant-baseline="central" text-anchor="middle">${
					b.color === "white" ? i + 1 : ""
				}</text>`,
			""
		)}</svg>`;
	}

	set(n: number, color: "orange" | "blue" | "black") {
		this.items[n - 1].color = color;
	}

	getColor(n: number) {
		return this.items[n - 1].color;
	}
}

export default AZ;
