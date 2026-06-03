import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createClass } from "../../api/classApi";

interface Props {
  onCreated: () => void;
}

export default function ClassForm({ onCreated }: Props) {
  const [className, setClassName] = useState("");
  const [classType, setClassType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !classType) return;
    setLoading(true);
    try {
      await createClass({ class_name: className, class_type: classType });
      setClassName("");
      setClassType("");
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Class Name</Label>
        <Input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="e.g. Grade 10 - Section A"
          className="w-56 h-9 text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Type</Label>
        <Select onValueChange={setClassType} value={classType}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="advisory">Advisory</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-9 bg-green-600 hover:bg-green-700 text-white text-sm"
      >
        {loading ? "Adding…" : "Add Class"}
      </Button>
    </form>
  );
}
