'use client';
import React, { useState } from 'react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { format } from 'date-fns';
import { MdCalendarMonth } from 'react-icons/md';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Header = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card rounded-lg w-full p-3 sm:p-4 mt-8 gap-3 sm:gap-4">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="w-full sm:w-auto order-1 sm:order-1">
        <Menubar className="w-full sm:w-auto flex-wrap">
          <MenubarMenu>
            <MenubarTrigger className="text-xs sm:text-sm px-2 sm:px-3">Overview</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs sm:text-sm px-2 sm:px-3">Analytics</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs sm:text-sm px-2 sm:px-3">Reports</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs sm:text-sm px-2 sm:px-3">Settings</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Date picker - full width on mobile, auto width on desktop */}
      <div className="w-full sm:w-auto order-2 sm:order-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full sm:w-[280px] justify-start text-left font-normal text-xs sm:text-sm h-9 sm:h-10',
                !date && 'bg-muted text-muted-foreground',
              )}
            >
              <MdCalendarMonth className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{date ? format(date, 'PPP') : 'Pick a date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
