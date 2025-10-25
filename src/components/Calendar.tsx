import type { EventContentArg } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps?: {
    description?: string;
    location?: string;
  };
}

interface CalendarProps {
  events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="p-4 bg-white border-black rounded-2xl shadow-brutalSm border-3">
      <FullCalendar
        locale={deLocale}
        initialView="listMonth"
        plugins={[listPlugin, dayGridPlugin]}
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next',
        }}
        events={events}
        eventContent={(arg: EventContentArg) => {
          const title = arg.event.title;
          const timeText = arg.timeText;
          const description =
            arg.event.extendedProps?.description ||
            'Keine Beschreibung verfügbar';

          return (
            <div className="flex flex-col">
              <div className="font-bold">{title}</div>
              <div className="text-sm text-gray-600">{timeText}</div>
              <div className="mt-1 text-sm">{description}</div>
            </div>
          );
        }}
      />
    </div>
  );
}
