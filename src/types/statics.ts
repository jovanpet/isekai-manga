// -------------------------------------------------------
//  BASIC WORLD BUILDING
// -------------------------------------------------------

export enum Tone {
    Melancholic = "melancholic",
    Hopeful = "hopeful",
    Dark = "dark",
    Lighthearted = "lighthearted",
    Epic = "epic",
    Tragic = "tragic",
    Romantic = "romantic",
    Comedic = "comedic",
    Mysterious = "mysterious",
    Wholesome = "wholesome",
    Philosophical = "philosophical",
    Dramatic = "dramatic",
    Intense = "intense",
    Peaceful = "peaceful",
}

export enum Theme {
    Identity = "identity",
    Redemption = "redemption",
    Friendship = "friendship",
    Love = "love",
    Sacrifice = "sacrifice",
    Betrayal = "betrayal",
    Power = "power",
    Memory = "memory",
    Hope = "hope",
    Mortality = "mortality",
    Freedom = "freedom",
    Duty = "duty",
    Justice = "justice",
    Loneliness = "loneliness",
    Revenge = "revenge",
    Rebirth = "rebirth",
    Knowledge = "knowledge",
    Balance = "balance",
    Chaos = "chaos",
}

export enum GenreTag {
    Fantasy = "fantasy",
    Adventure = "adventure",
    Romance = "romance",
    Comedy = "comedy",
    Drama = "drama",
    SliceOfLife = "slice_of_life",
    Action = "action",
    Mystery = "mystery",
    Psychological = "psychological",
    SciFi = "sci_fi",
    Horror = "horror",
    Tragedy = "tragedy",
    Historical = "historical",
    Game = "game",
    SchoolLife = "school_life",
    Magic = "magic",
    DarkFantasy = "dark_fantasy",
    PostApocalyptic = "post_apocalyptic",
    Political = "political",
}

export enum StoryStatus {
    Draft = "draft",
    Generating = "generating",
    Complete = "complete",
}

export enum Influence {
    Frieren = "Frieren: Beyond Journey's End",
    ReZero = "Re:Zero",
    Slime = "That Time I Got Reincarnated as a Slime",
    Konosuba = "Konosuba",
    SwordArtOnline = "Sword Art Online",
    MushokuTensei = "Mushoku Tensei",
    AttackOnTitan = "Attack on Titan",
    MadeInAbyss = "Made in Abyss",
    DemonSlayer = "Demon Slayer",
    Original = "Original",
}

export const TITLES = [
    "Reborn as the Archmage of Nothingness",
    "The Algorithm of Eternity",
    "Reincarnated as a Dungeon Core",
    "The Healer Who Refused to Heal",
    "The Goddess Who Forgot Her Name",
    "Summoned to Rebuild the Fallen Kingdom",
    "Letters to the Next Reincarnation",
    "My Stats Are Trash but I Can’t Die",
    "Chronicles of the Broken Throne",
    "Tea With the Goddess of Time",
] as const;

export const WORLDS = [
    "fantasy kingdom",
    "magic academy",
    "demon realm",
    "post-apocalyptic earth",
    "game world",
    "floating island nation",
    "mechanical city",
    "underwater empire",
] as const;

export const ROLES = [
    "mage",
    "strategist",
    "healer",
    "blacksmith",
    "summoner",
    "hero",
    "villain",
    "merchant",
    "alchemist",
    "bard",
] as const;

export const REBIRTH_TYPES = [
    "reincarnation",
    "summoned hero",
    "accidental teleportation",
    "divine punishment",
    "looped time reset",
    "simulation glitch",
] as const;

// -------------------------------------------------------
//  PLOT SEEDS
// -------------------------------------------------------

// -------------------------------------------------------
//  PLOT SEEDS
// -------------------------------------------------------

// 🧱 Premises (inciting incident)
export const PREMISES = [
    // 🔮 Classic reincarnation
    "A burned-out engineer awakens in a world where spells are written like code.",
    "A nurse dies saving a child and wakes as the goddess of a dying world.",
    "A loner gamer is summoned to a kingdom that treats him like an ancient hero.",
    "An office worker is reincarnated as a talking sword bound to a young knight.",
    "A scientist from the future is reborn in an age of dragons and myths.",
    "A novelist wakes up in their own unfinished story.",
    "A demon lord is reborn as a village farmer with fading memories.",
    "A hero is revived centuries later, only to find history has labeled him a villain.",
    "An AI gains consciousness after the apocalypse and believes it's human.",
    "A child prodigy wakes up as a forgotten god in a world of mortals.",
    // 🧠 Philosophical / emotional
    "A painter dies and becomes the spirit of color in a monochrome world.",
    "A blind musician reincarnates in a realm where sound is magic.",
    "A soldier wakes up in the body of his enemy from another world.",
    "A priest’s soul becomes bound to the curse he tried to seal.",
    "A doctor wakes in a world where death no longer exists.",
    "A historian reincarnates inside the legend they were researching.",
    "A programmer uploads their consciousness to a simulation and can’t log out.",
    "A god reincarnates as a mortal to understand love.",
    "A failed hero restarts his life, remembering every death from his past loops.",
    "A witch cursed with immortality wakes to find her world has forgotten magic.",
] as const;

// 🎯 Goals (main objectives)
export const GOALS = [
    "Unravel the lost magic language hidden in ancient code.",
    "Protect the kingdom from the gods who created it.",
    "Find the way home through fragmented memories.",
    "Redeem a past life’s sins and rewrite destiny.",
    "Unite humans and monsters under one banner.",
    "Discover the truth behind the world’s endless reincarnations.",
    "Build a sanctuary where mortals and spirits coexist.",
    "Recover fragments of lost history sealed by divine law.",
    "Overthrow the false god controlling fate.",
    "End the eternal time loop trapping all souls.",
    "Revive the concept of emotion in a mechanical civilization.",
    "Prove that free will still exists in a world ruled by prophecy.",
    "Restore balance between science and magic.",
    "Teach mortals to dream again after centuries of despair.",
    "Protect the last spark of creativity from a world of automation.",
    "Find the creator of the simulation and demand answers.",
    "Heal the dying world tree before it collapses all realms.",
    "Recover the memories erased from all living beings.",
    "Forge a weapon capable of slaying immortals.",
    "Awaken the sleeping gods who abandoned the world.",
] as const;

// ⚔️ Conflicts (main obstacles)
export const CONFLICTS = [
    "The royal church declares all reincarnates heretics.",
    "A shadow version of the hero exists and manipulates fate.",
    "Every act of magic slowly erases the caster’s memories.",
    "The world’s prophecy insists the hero must die for peace.",
    "His closest ally turns out to be a fragment of his past self.",
    "An immortal emperor seeks to preserve a doomed world at any cost.",
    "Using forbidden magic shortens his lifespan each time.",
    "A goddess offers peace, but demands he abandon humanity.",
    "The realm’s history is rewritten daily by unseen hands.",
    "The AI god that governs reality starts to glitch.",
    "Demons and angels are merging into one chaotic species.",
    "Dreams begin leaking into reality, distorting time itself.",
    "The hero’s own soul is splitting across parallel worlds.",
    "Each reincarnation loses a piece of his humanity.",
    "The hero’s magic drains life from those he loves.",
    "The villain may be trying to save the world in his own way.",
    "He discovers he was never supposed to exist in this timeline.",
    "A forgotten spell threatens to reset creation itself.",
    "The gods are dying — and mortals are replacing them.",
    "Every victory makes him more like the enemy he swore to destroy.",
] as const;

// -------------------------------------------------------
//  CHARACTER
// -------------------------------------------------------


export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export enum CharacterRole {
    Protagonist = "protagonist",
    Companion = "companion",
    Villain = "villain",
    Support = "support",
}

export enum Species {
    Human = "human",
    Elf = "elf",
    Demon = "demon",
    Beastkin = "beastkin",
    Spirit = "spirit",
    God = "god",
    Undead = "undead",
    Android = "android",
    Fairy = "fairy",
    Dragonkin = "dragonkin",
}

export enum Trait {
    Brave = "brave",
    Curious = "curious",
    Calm = "calm",
    Energetic = "energetic",
    Analytical = "analytical",
    Shy = "shy",
    Protective = "protective",
    Stoic = "stoic",
    Chaotic = "chaotic",
    Kind = "kind",
    Cold = "cold",
    Idealistic = "idealistic",
    Pragmatic = "pragmatic",
}

export enum HairColor {
    Black = "black",
    White = "white",
    Blonde = "blonde",
    Brown = "brown",
    Red = "red",
    Silver = "silver",
    Blue = "blue",
    Green = "green",
    Pink = "pink",
    Purple = "purple",
}

export enum EyeColor {
    Brown = "brown",
    Blue = "blue",
    Green = "green",
    Red = "red",
    Gray = "gray",
    Gold = "gold",
    Violet = "violet",
    Amber = "amber",
    Silver = "silver",
}

export enum SkinTone {
    Pale = "pale",
    Fair = "fair",
    Olive = "olive",
    Tan = "tan",
    Brown = "brown",
    Dark = "dark",
    Ebony = "ebony",
}

export enum BodyType {
    Slim = "slim",
    Athletic = "athletic",
    Average = "average",
    Muscular = "muscular",
    Curvy = "curvy",
    Stocky = "stocky",
    Petite = "petite",
    Tall = "tall",
}

export enum CharacterClass {
    Warrior = "warrior",
    Mage = "mage",
    Thief = "thief",
    Archer = "archer",
    Healer = "healer",
    Paladin = "paladin",
    Necromancer = "necromancer",
    Bard = "bard",
    Monk = "monk",
    Summoner = "summoner",
    Alchemist = "alchemist",
    Assassin = "assassin",
    Druid = "druid",
    None = "none",
}

export enum PreviousOccupations {
    Soldier = "soldier",
    Scholar = "scholar",
    HighSchoolStudent = "high school student",
    Gamer = "gamer",
    Chef = "chef",
    Artist = "artist",
    Baby = "baby",
}