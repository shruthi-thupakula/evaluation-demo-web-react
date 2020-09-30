import format from "date-fns/format";

const DATE_FORMAT_12HOURS = "dd/MM/yyyy hh:mm:ss a";
const DATE_FORMAT_24HOURS = "dd/MM/yyyy HH:mm:ss";

/**
 * @method prepareDate
 * @description formats the date to human readable view and converts to 24/12 hours format
 * @param {dateTime} date date to be parsed
 * @param {12|24} hoursFormat hours format to return
 * @returns formatted date or raw date on error
 */
export const prepareDate = (date, hoursFormat = 12) => {
  try {
    return format(
      new Date(date),
      hoursFormat === 12 ? DATE_FORMAT_12HOURS : DATE_FORMAT_24HOURS
    );
  } catch (error) {
    console.error("prepareDate:error:", error.message);
    return date;
  }
};
