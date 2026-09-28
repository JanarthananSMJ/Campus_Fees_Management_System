import React from "react";
import { useParams } from "react-router-dom";
import { FileDown } from "lucide-react";
import { Button, Card } from "../../components/ui";

export default function Report() {
  const { id } = useParams();

  const download = () => {
    const token = sessionStorage.getItem("token");
    window.open(`http://localhost:8080/api/students/${id}/report?token=${token}`);
  };

  return (
    <Card className="flex flex-col items-center gap-4 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <FileDown className="h-6 w-6" />
      </div>
      <div>
        <h2 className="font-semibold text-slate-900">Download Fee Report</h2>
        <p className="mt-1 text-sm text-slate-500">Get a PDF summary of fee status for this student.</p>
      </div>
      <Button onClick={download}>Download PDF</Button>
    </Card>
  );
}
