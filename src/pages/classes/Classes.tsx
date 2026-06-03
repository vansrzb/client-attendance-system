import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import ClassForm from "../../components/classes/ClassForm";
import ClassTable from "../../components/classes/ClassTable";
import type { Class } from "../../types/class";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selected, setSelected] = useState<Class | null>(null);

  const load = () => getClasses().then(setClasses);
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Classes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your classes</p>
      </div>
      <ClassForm onCreated={load} />
      <ClassTable classes={classes} onDeleted={load} onSelect={setSelected} selected={selected} />
    </div>
  );
}