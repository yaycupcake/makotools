import { BirthdayEvent, GameEvent, ScoutEvent } from "../types/game";

function retrieveEvents(data: any): (BirthdayEvent | GameEvent | ScoutEvent)[] {
  let events: (BirthdayEvent | GameEvent | ScoutEvent)[] = [];

  if (data.characters) {
    for (const character of data.characters) {
      let birthdayEvent: BirthdayEvent = {
        character_id: character.character_id,
        name: `${character.first_name[0]}${
          character.last_name[0] ? " " + character.last_name[0] : ""
        }`,
        start_date: character.birthday,
        end_date: character.birthday,
        type: "birthday",
        banner_id: character.renders?.fs1_5 | 0,
      };

      events.push(birthdayEvent);
    }
  }

  if (data.gameEvents) {
    for (const event of data.gameEvents) {
      let gameEvent: GameEvent = {
        event_id: event.event_id,
        start_date: event.start_date[1],
        end_date: event.end_date[1],
        type: event.type[1],
        name: event.name[1],
        event_gacha: event.event_gacha[1],
        event_gacha_id: event.gacha_id[1],
        banner_id: event.banner_id[1],
        story_name: event.story_name[1],
      };
      events.push(gameEvent);
    }
  }

  if (data.scouts) {
    for (const scout of data.scouts) {
      let scoutEvent: ScoutEvent = {
        gacha_id: scout.gacha_id,
        start_date: scout.start_date[1],
        end_date: scout.end_date[1],
        type: scout.type[1],
        name: scout.name[1],
        banner_id: scout.five_star.card_id[1],
      };
      events.push(scoutEvent);
    }
  }

  return events;
}

function areDatesEqual(dateA: string, dateB: string): boolean {
  if (
    dateA.split("-")[0] === dateB.split("-")[0] &&
    dateA.split("-")[1] === dateB.split("-")[1] &&
    dateA.split("-")[2] === dateB.split("-")[2]
  ) {
    return true;
  } else {
    return false;
  }
}

function areMonthYearEqual(dateA: string, dateB: string): boolean {
  if (
    dateA.split("-")[0] === dateB.split("-")[0] &&
    dateA.split("-")[1] === dateB.split("-")[1]
  ) {
    return true;
  } else {
    return false;
  }
}

export { retrieveEvents, areDatesEqual, areMonthYearEqual };
