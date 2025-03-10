import { useRecoilState } from "recoil";
import { doneCountAtom, savedRecordsAtom, countAtom } from "./atoms";
import { useRef } from "react";

export function useRecordStatus() {
  const [doneCount, setDoneCount] = useRecoilState(doneCountAtom);
  const [savedRecords, setSavedRecords] = useRecoilState(savedRecordsAtom);
  const [allCount, setAllCount] = useRecoilState(countAtom);

  const allCountRef = useRef(allCount);
  allCountRef.current = allCount;

  const goalCount = 1000;
  const restCount = goalCount - doneCount;

  const saveRecord = (count) => {
    if (count + doneCount > goalCount) count = goalCount - doneCount;
    if (count === 0) return;

    const id = ++allCountRef.current;
    setAllCount(id);
    const newRecord = {
      id: id,
      count: count,
      regDate: new Date().toISOString(),
    };
    setSavedRecords((prev) => [newRecord, ...prev]);
    setDoneCount(doneCount + count);
  };

  const deleteRecord = (id) => {
    const index = findIndexById(id);
    const count = savedRecords[index]?.count ?? 0;
    const newRecords = savedRecords.filter((_, _index) => _index !== index);
    setSavedRecords(newRecords);
    setDoneCount(doneCount - count);
  };

  const modifyRecord = (id, newCount) => {
    const index = findIndexById(id);
    const count = findCountById(id);
    const newRecords = savedRecords.map((el, _index) =>
      _index === index ? { ...el, count: newCount } : el
    );
    setSavedRecords(newRecords);
    setDoneCount(doneCount - count + newCount);
  };

  const findIndexById = (id) => {
    return Number(savedRecords.length - id);
  };

  const findCountById = (id) => {
    const index = findIndexById(id);
    return savedRecords[index]?.count ?? 0;
  };

  return {
    goalCount,
    restCount,
    saveRecord,
    savedRecords,
    deleteRecord,
    modifyRecord,
    findCountById,
  };
}
