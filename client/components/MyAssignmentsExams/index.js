import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import formatDate from 'date-fns/format';
import getYear from 'date-fns/get_year';
import calcTermForDate from 'utils/calcTermForDate';
import termNameForCode from 'utils/termNameForCode';
import ScheduleTable from './ScheduleTable';
import MyAssignmentsExamsScheduleItem from 'components/MyAssignmentsExamsScheduleItem';

import { TERM_DATES, TERM_CODES_TO_NAMES } from 'const';

import styles from './MyAssignmentsExams.css';

const currentTermEndDate = () => {
  const currentTerm = calcTermForDate().substr(3);
  const dates = TERM_DATES[TERM_CODES_TO_NAMES[currentTerm]];
  const currentYear = getYear(new Date());
  const endDate = new Date(
    currentYear,
    parseInt(dates.end.month) - 1,
    parseInt(dates.end.day),
    23,
    59,
    59
  );
  return formatDate(endDate, 'YYYY-MM-DD');
};

const createAssignmentsExamsGrouped = (scheduleForRangeInTerm) => {
  const assignmentsExamsGrouped = {};
  scheduleForRangeInTerm
    .filter((s) => s.type === 'assignment' || s.type === 'exam')
    .forEach((item) => {
      const groupName = formatDate(new Date(item.end_at), 'YYYY-MM-DD');
      if (!assignmentsExamsGrouped.hasOwnProperty(groupName)) {
        assignmentsExamsGrouped[groupName] = [];
      }
      assignmentsExamsGrouped[groupName].push(item);
    });
  return assignmentsExamsGrouped;
};

export const _MyAssignmentsExams = ({
  assignmentExamSchedule: { scheduleForRangeInTerm },
}) => {
  const assignmentsExamsGrouped = createAssignmentsExamsGrouped(
    scheduleForRangeInTerm
  );

  const groups = Object.keys(assignmentsExamsGrouped).map((date, i) => {
    const items = assignmentsExamsGrouped[date]
      .sort((a, b) => {
        if (a.type > b.type) return -1;
        if (a.type < b.type) return 1;
        return 0;
      })
      .map((item, i) => <MyAssignmentsExamsScheduleItem item={item} key={i} />);

    return (
      <ScheduleTable date={formatDate(new Date(date), 'dddd, MMMM D')} key={i}>
        {items}
      </ScheduleTable>
    );
  });
  return (
    <div className={styles.myAssignmentsExams}>
      <h2 className={styles.termName}>{termNameForCode(calcTermForDate())}</h2>
      {groups.length ? (
        groups
      ) : (
        <p className={styles.noAssignmentsExams}>
          No upcoming assignments or exams
        </p>
      )}
    </div>
  );
};

_MyAssignmentsExams.propTypes = {
  assignmentExamSchedule: PropTypes.object.isRequired,
};

export const MyAssignmentsExams = Relay.createContainer(_MyAssignmentsExams, {
  initialVariables: {
    term: calcTermForDate(),
    rangeStart: formatDate(new Date(), 'YYYY-MM-DD'),
    rangeEnd: currentTermEndDate(),
  },
  fragments: {
    assignmentExamSchedule: () => Relay.QL`
      fragment on ViewerType {
        scheduleForRangeInTerm(term: $term, rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
          dept
          description
          end_at
          location_address
          location_buildingcode
          location_campus
          location_name
          location_roomnumber
          number
          section
          source
          start_at
          title
          type
          url
        }
      }
    `,
  },
});
