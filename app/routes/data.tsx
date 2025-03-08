import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";
import { z } from "zod";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Rider KYC Data" },
    { name: "description", content: "" },
  ];
}

const API_URL = "https://fluxx-response-be.onrender.com/drivers";

// Define schema using Zod
const DriverSchema = z.object({
  name: z.string(),
  address: z.string(),
  vehicle: z.string(),
  aadharNumber: z.string(),
  riderPhoto: z.string(),
  aadharFile: z.string(),
  panFile: z.string().nullable().optional(),
  dlFile: z.string().nullable().optional(),
  panNumber: z.string().optional(),
  dlNumber: z.string().optional(),
});

type Driver = z.infer<typeof DriverSchema>;

export default function AdminLoginTable() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Check local storage for login status on mount
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
      fetchDrivers();
    }
  }, []);

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      fetchDrivers();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data);
      const baseUrl = "https://fluxx-response-be.onrender.com/";

      // Ensure all URLs are absolute
      const updatedData = data.map((driver: any) => ({
        ...driver,
        aadharFile: driver.aadharFile ? baseUrl + driver.aadharFile : null,
        panFile: driver.panFile ? baseUrl + driver.panFile : null,
        dlFile: driver.dlFile ? baseUrl + driver.dlFile : null,
        riderPhoto: driver.riderPhoto ? baseUrl + driver.riderPhoto : null,
      }));

      const validatedData = z.array(DriverSchema).parse(updatedData);
      console.log(validatedData);
      setDrivers(validatedData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  return (
    <div className="h-screen flex">
      {!isLoggedIn ? (
        // Centered Login Card
        <div className="flex justify-center items-center w-full">
          <Card className="p-6 w-96">
            <CardContent className="flex flex-col gap-4">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Left-aligned Table
        <div className="p-6 w-full max-w-7xl overflow-x-auto mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rider KYC Data</h2>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Aadhar Number</TableHead>
                <TableHead>Aadhar File</TableHead>
                <TableHead>PAN Number</TableHead>
                <TableHead>PAN File</TableHead>
                <TableHead>DL Number</TableHead>
                <TableHead>DL File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-base">
                      <Dialog>
                        <DialogTrigger onClick={() => setSelectedImage(driver.riderPhoto)}>
                          <img src={driver.riderPhoto} alt={driver.name} className="w-8 h-8 cursor-pointer rounded-full" />
                        </DialogTrigger>
                        <DialogContent>
                          <img src={selectedImage || ""} alt="Selected" className="w-full" />
                        </DialogContent>
                      </Dialog>

                      {driver.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-base">{driver.address}</TableCell>
                  <TableCell className="text-base">{driver.vehicle}</TableCell>
                  <TableCell className="text-base">{driver.aadharNumber}</TableCell>

                  {/* Aadhar File */}
                  <TableCell className="text-base">
                    <a href={driver.aadharFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View Aadhar
                    </a>
                  </TableCell>

                  {/* PAN Number & PAN File */}
                  <TableCell className="text-base">{driver.panNumber || "None"}</TableCell>
                  <TableCell className="text-base">
                    {driver.panFile ? (
                      <a href={driver.panFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View PAN
                      </a>
                    ) : (
                      "None"
                    )}
                  </TableCell>

                  {/* DL Number & DL File */}
                  <TableCell className="text-base" >{driver.dlNumber || "None"}</TableCell>
                  <TableCell className="text-base">
                    {driver.dlFile ? (
                      <a href={driver.dlFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View DL
                      </a>
                    ) : (
                      "None"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

