import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCountries } from "@/store/server/useCountries";
import { IoSearch } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import Image from "next/image";

export const CountrySelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string, phoneCode: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: countries, isLoading } = useCountries();

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter((country) =>
      country.country_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [countries, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <Input readOnly value={value || ""} placeholder="Country (auto)" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Country</DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="relative mb-3">
          <IoSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
          <Input
            placeholder="Search country"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Country list */}
        <ScrollArea className="max-h-[350px] pr-2">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : filteredCountries.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No countries found</p>
          ) : (
            <div className="space-y-2">
              {filteredCountries.map((country) => (
                <div
                  key={country.id}
                  onClick={() => {
                    onChange(country.country_name, country.country_code);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center border rounded-md px-3 py-2 hover:bg-accent cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Flag */}
                    <div className="relative w-8 h-8">
                      <Image
                        src={`https://flagcdn.com/w40/${country.country_code.toLowerCase()}.png`}
                        alt={country.country_name}
                        className="object-contain w-full h-full"
                        fill
                      />
                    </div>
                    <span className="font-medium">{country.country_name}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                    <FaPhone className="text-xs" /> {country.phone_code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
