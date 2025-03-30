"use client";
import React, { useState } from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { format } from "date-fns";
import { MdCalendarMonth } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header = () => {
  const [date, setDate] = useState<Date>();
  return (
    <div className=" flex flex-col md:flex-row justify-between bg-card rounded-lg w-full p-2 mt-8">
      <Menubar className=" md:w-[25%] mb-2">
        <MenubarMenu>
          <MenubarTrigger>overview</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Analytics</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>overview</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>overview</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "bg-muted text-muted-foreground"
            )}
          >
            <MdCalendarMonth className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Header;
