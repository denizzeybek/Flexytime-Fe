import dayjs from 'dayjs';

export const useTimeManagement = () => {
  const generateDateRange = (startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return Array.from({ length: end.diff(start, 'day') + 1 }, (_, i) => {
      const currentDate = start.add(i, 'day');
      return {
        title: currentDate.format('DD MMM'),
        subTitle: currentDate.format('dddd'),
      };
    });
  };

  const generateTableColumns = (headers: any, startDate: string, endDate: string) => {
    console.log(startDate, endDate);
    const keys = ['title', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    return keys.map((key, index) => ({
      field: key,
      header: {
        title: headers[index - 1]?.title,
        subTitle: headers[index - 1]?.subTitle,
      },
      expander: key === 'title',
    }));
  };

  const generateTableData = (list: any[], startDate: string, endDate: string) => {
    console.log(startDate, endDate);

    if (!list.length) return [];
    return list.map((person, idx) => {
      const days = person.Days;
      const name = person.Name;
      const children = person.Children;
      const keys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
      return {
        key: idx.toString(),
        data: {
          title: name,
          ...days.reduce((acc, time, index) => {
            acc[keys[index]] = time;
            return acc;
          }, {}),
        },
        children: children.map((child, index) => {
          return {
            key: `${idx}-${index}`,
            data: {
              title: child.Name,
              ...child.Days.reduce((acc, time, index) => {
                acc[keys[index]] = time;
                return acc;
              }, {}),
            },
          };
        }),
      };
    });
  };

  return {
    generateDateRange,
    generateTableColumns,
    generateTableData,
  };
};
