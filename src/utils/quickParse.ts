import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uk";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {selectActiveTooltipDataKey} from "recharts/types/state/selectors/tooltipSelectors";
dayjs.extend(customParseFormat);

dayjs.locale("ru");

type ParseResult = {
    title: string;
    dueDate: string;
    time?: string;
};

const WEEKDAYS_RU = ['воскресенье','понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const WEEKDAYS_UA = ["неділя","понеділок","вівторок","середа","четвер","пʼятниця","субота"];
const WEEKDAYS_SHORT_RU = ["вс","пн","вт","ср","чт","пт","сб"];
const WEEKDAYS_SHORT_UA = ["нд","пн","вт","ср","чт","пт","сб"];

const norm = (s: string) => s.replace(/\s+/g, "").trim();

function findDate(input: string): { date: dayjs.Dayjs | null, rest: string } {
    let text = input.toLowerCase();

    const todayMatch = /\b(сьогодні|сегодня)\b/.exec(text);
    if (todayMatch) {
        const d = dayjs();
        return {date: d, rest: norm(text.replace(todayMatch[0], ""))};
    }

    const tomorrowMatch = /\b(завтра)\b/.exec(text);
    if (tomorrowMatch) {
        const d = dayjs().add(1, "day");
        return {date: d, rest: norm(text.replace(tomorrowMatch[0], ""))};
    }

    const afterTomorrowMatch = /\b(післязавтра|послезавтра)\b/.exec(text);
    if (afterTomorrowMatch) {
        const d = dayjs().add(2, "day");
        return {date: d, rest: norm(text.replace(afterTomorrowMatch[0], ""))};
    }

    const weekdays = [
        ...WEEKDAYS_RU, ...WEEKDAYS_UA,
        ...WEEKDAYS_SHORT_RU, ...WEEKDAYS_SHORT_UA
    ];

    for (const w of weekdays) {
        const re = new RegExp(`\\b${w}\\b`)
        const m = re.exec(text);
        if (m) {
            const allMaps: Record<string, number> = {};
            WEEKDAYS_RU.forEach((n, i) => allMaps[n] = i);
            WEEKDAYS_UA.forEach((n, i) => (allMaps[n] = i));
            WEEKDAYS_SHORT_RU.forEach((n, i) => (allMaps[n] = i));
            WEEKDAYS_SHORT_UA.forEach((n, i) => (allMaps[n] = i));

            const targetDow = allMaps[w];
            let d = dayjs();
            while (d.day() !== targetDow) d = d.add(1,"day");
            return {date: d, rest: norm(text.replace(m[0], ""))};
        }
    }

    const dateRe = /\b(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?\b/;
    const dm = dateRe.exec(text);
    if (dm) {
        const [, dd, mm, yyyy] = dm;
        const year = yyyy ? (yyyy.length === 2 ? `20${yyyy}` : yyyy) : String(dayjs().year());
        const parsed = dayjs(`${year}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`, "YYYY-MM-DD");
        if (parsed.isValid()) {
            return {date: parsed, rest: norm(text.replace(dm[0], ""))};
        }
    }

    return { date: dayjs(), rest: text};
}

function findTime(input: string): {time?: string, rest: string} {
    let text = input;

    const patterns = [
        /\bв\s?(\d{1,2}):(\d{2})\b/i,
        /\bв\s?(\d{1,2})\b/i,
        /\b(\d{1,2}):(\d{2})\b/
    ]

    for (const re of patterns) {
        const m = re.exec(text);
        if (m) {
            let hh = m[1];
            let mm = m[2] ?? "00";
            hh = hh.padStart(2, "0");
            const time = `${hh}:${mm}`;
            return {time, rest: norm(text.replace(m[0], ""))};
        }
    }
    return {rest : text};
}

export function parseQuickTask(input: string) : ParseResult {
    let text = norm(input);

    const {date, rest: afterDate } = findDate(text);
    let workText = afterDate;

    const { time, rest: afterTime} = findTime(workText);

    const title = norm(afterTime).replace(/^[—\-–:]+/, "").trim() || "Новая задача";

    return {
        title,
        dueDate: date!.format("YYYY-MM-DD"),
        ...(time ? {time} : {})
    };
}