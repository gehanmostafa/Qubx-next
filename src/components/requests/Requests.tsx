"use client";
import Navbar from "@/components/layouts/Navbar";
import RequestsTable from "@/components/requests/RequestsTable";
import { Button } from "@/components/ui/button";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Requests = () => {
  const [viewMode, setViewMode] = useState("list");
  return (
    <>
      <Navbar />
      <div className="bg-primary-foreground min-h-[88vh]">
        <div className="md:w-11/12 mx-auto py-4">
          <div className="bg-background rounded-lg flex justify-between flex-col md:flex-row gap-y-2 md:gap-y-0 items-center px-8 py-2">
            <div className="space-x-2 flex text-muted-foreground">
              <Button
                variant={viewMode === "list" ? "secondary" : "outline"}
                className="rounded-full w-24 h-12 text-sm font-semibold"
                onClick={() => setViewMode("list")}
              >
                <FaListUl /> List
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "outline"}
                className="rounded-full w-24 h-12 text-sm font-semibold"
                onClick={() => setViewMode("grid")}
              >
                <IoGrid /> Grid
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="rounded-full w-38 h-12 font-semibold flex items-center gap-2"
                >
                  <LuPlus /> New Request
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>New Request</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <form className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Request Title"
                      className="border rounded-md px-3 py-2"
                    />
                    <textarea
                      placeholder="Description"
                      className="border rounded-md px-3 py-2 h-24"
                    />
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-background rounded-lg px-2 md:px-8 py-4 mt-5">
            <RequestsTable viewMode={viewMode} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Requests;
