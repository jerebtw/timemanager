import ErrorNotification from "@/components/errorNotification/errorNotification";
import Loading from "@/components/loading/loading";
import Navbar from "@/components/navbar/navbar";
import { PocketBaseContext } from "@/context/pocketbase";
import { BookingYearView } from "@/pocketbase/collections";
import { BookingYear } from "@/pocketbase/types";
import { Box, Button, Select, Stack } from "@mantine/core";
import { IconCalendarWeek } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeek from "dayjs/plugin/isoWeek";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import { useContext, useState } from "react";
dayjs.extend(isLeapYear);
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

function getDateRange(week: number, year: number): string {
  const weekDate = dayjs().year(year).isoWeek(week);
  const startDate = weekDate.isoWeekday(1);
  const endDate = weekDate.isoWeekday(7);
  return `${startDate.format("DD.MM.YYYY")} - ${endDate.format("DD.MM.YYYY")}`;
}

function findYearWeeks(queryData: BookingYear[] | undefined, year: number) {
  return queryData?.find((item) => item.year === year)?.weeks || [];
}

export default function CalendarPage() {
  const { loading, auth, pocketBase } = useContext(PocketBaseContext);
  const currentDate = dayjs();
  const [year, setYear] = useState<string | null>(
    currentDate.year().toString(),
  );
  const [week, setWeek] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["bookingYears"],
    queryFn: async () => {
      return await pocketBase!
        .collection(BookingYearView)
        .getFullList<BookingYear>();
    },
    enabled: !loading && !!auth && !!pocketBase,
  });

  const weeks = findYearWeeks(query.data, Number(year)).sort();

  return (
    <Navbar title="Calendar">
      {query.isFetching ? (
        <Box pr={150}>
          <Loading fullHeight />
        </Box>
      ) : query.isError ? (
        <ErrorNotification fullHeight />
      ) : (
        <Stack gap="sm">
          <Select
            label="Year"
            value={year}
            onChange={(value) => {
              const weeksOfYear = findYearWeeks(query.data, Number(value));
              const currentWeek = dayjs().isoWeek();
              const foundWeek = weeksOfYear.find(
                (item) => item === currentWeek,
              );
              if (foundWeek) {
                setWeek(foundWeek.toString());
              } else {
                setWeek(null);
              }

              setYear(value);
            }}
            data={query.data?.map((item) => item.year.toString())}
            required
          />

          <Select
            label="Week"
            value={week}
            onChange={(value) => setWeek(value)}
            data={weeks.map((item) => ({
              label: `${item} | ${getDateRange(item, Number(year))}`,
              value: item.toString(),
            }))}
            allowDeselect={false}
            searchable
            required
          />

          <Button leftSection={<IconCalendarWeek size={16} />}>
            Show week
          </Button>
        </Stack>
      )}
    </Navbar>
  );
}
