/**
 * Human-readable labels and descriptions for each matrix position.
 *
 * SWAP POINT: Update these strings to match a different esoteric system's
 * positional naming conventions.
 */

export interface PositionMeta {
  label: string;
  description: string;
  icon: string; // emoji icon for display
  color: string; // Tailwind gradient stop color name
}

export const POSITION_META: Record<string, PositionMeta> = {
  // Octagram cardinal points
  center: {
    label: "Центральная энергия",
    description: "Ядро личности, основная жизненная энергия, главная сила характера",
    icon: "✦",
    color: "violet",
  },
  sky: {
    label: "Небо — Предназначение",
    description: "Духовная миссия, высшее предназначение, путь эволюции души",
    icon: "☽",
    color: "indigo",
  },
  earth: {
    label: "Земля — Материя",
    description: "Отношение к телу, деньгам и материальному миру, связь с физической реальностью",
    icon: "◈",
    color: "emerald",
  },
  male: {
    label: "Мужская энергия",
    description: "Активное начало, действие, социальная реализация и карьерная энергия",
    icon: "→",
    color: "blue",
  },
  female: {
    label: "Женская энергия",
    description: "Рецептивное начало, эмоции, интуиция и способность принимать",
    icon: "←",
    color: "rose",
  },

  // Diagonal points
  northeast: {
    label: "Северо-восток",
    description: "Зона социальной реализации и духовного действия",
    icon: "↗",
    color: "amber",
  },
  southeast: {
    label: "Юго-восток",
    description: "Зона практического воплощения активной энергии",
    icon: "↘",
    color: "orange",
  },
  southwest: {
    label: "Юго-запад",
    description: "Зона кармических задач и материальных уроков",
    icon: "↙",
    color: "purple",
  },
  northwest: {
    label: "Северо-запад",
    description: "Зона родовых программ и духовного наследия",
    icon: "↖",
    color: "teal",
  },

  // Derived interpretation positions
  purpose: {
    label: "Предназначение",
    description: "Главная задача этого воплощения и духовная миссия",
    icon: "★",
    color: "yellow",
  },
  relationships: {
    label: "Отношения",
    description: "Характер любовных и близких отношений, кармические партнёрства",
    icon: "♡",
    color: "pink",
  },
  finances: {
    label: "Финансы",
    description: "Отношение к деньгам, способы привлечения изобилия, финансовые уроки",
    icon: "◎",
    color: "gold",
  },
  talents: {
    label: "Таланты",
    description: "Природные дары, скрытые способности, ресурсы для реализации",
    icon: "✧",
    color: "cyan",
  },
  growth: {
    label: "Зона роста",
    description: "Ключевые вызовы и возможности для духовной и личностной эволюции",
    icon: "↑",
    color: "lime",
  },
  karma: {
    label: "Кармическая задача",
    description: "Уроки прошлого, которые необходимо интегрировать в этой жизни",
    icon: "∞",
    color: "purple",
  },
  strengths: {
    label: "Сильные стороны",
    description: "Природные ресурсы и достижения, доступные в этом воплощении",
    icon: "◆",
    color: "violet",
  },
};

/** Ordered list of interpretation positions for the UI display */
export const INTERPRETATION_ORDER: string[] = [
  "purpose",
  "relationships",
  "finances",
  "talents",
  "strengths",
  "growth",
  "karma",
];

/** Ordered list of octagram positions for the chart */
export const OCTAGRAM_POSITIONS: string[] = [
  "center",
  "sky",
  "earth",
  "male",
  "female",
  "northeast",
  "southeast",
  "southwest",
  "northwest",
];
