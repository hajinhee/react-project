import { Button, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { myConfetti } from "../util";

export function useRecordModalStatus() {
  const [opened, setOpened] = useState(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return {
    opened,
    open,
    close,
  };
}

export function RecordModal({
  recordModalStatus,
  msg,
  saveRecord: _saveRecord,
  cancelRecord: _cancelRecord = null,
  initialCount,
}) {
  const [recordeCount, setRecordeCount] = useState(initialCount);

  useEffect(() => {
    setRecordeCount(initialCount);
  }, [initialCount]);

  const increaseCount = (count) => {
    setRecordeCount(recordeCount + count);

    myConfetti({
      particleCount: count * 20,
      spread: 160,
    });
  };

  const decreaseCount = (count) => {
    if (recordeCount - count < 0) return;
    setRecordeCount(recordeCount - count);
  };

  const saveRecord = () => {
    setRecordeCount(initialCount);
    recordModalStatus.close();
    _saveRecord(recordeCount);
  };

  const cancelRecord = () => {
    setRecordeCount(initialCount);
    recordModalStatus.close();
    if (_cancelRecord != null) _cancelRecord();
  };

  return (
    <>
      <Modal
        open={recordModalStatus.opened}
        onClose={cancelRecord}
        className="flex justify-center items-center"
      >
        <div
          className="bg-white rounded-[20px] 
                        p-7 w-full max-w-sm sm:max-w-lg select-none"
        >
          <div className="text-center">{msg}</div>
          <div className="text-center font-mono text-[80px] sm:text-[120px] text-[color:var(--mui-color-primary-main)] py-2 select-none">
            {recordeCount.toString().padStart(2, "0")}
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="contained" onClick={() => increaseCount(5)}>
              <span className="!pt-1">+5</span>
            </Button>
            <Button variant="contained" onClick={() => increaseCount(1)}>
              <span className="!pt-1">+1</span>
            </Button>
            <Button variant="outlined" onClick={() => decreaseCount(5)}>
              <span className="!pt-1">-5</span>
            </Button>
            <Button variant="outlined" onClick={() => decreaseCount(1)}>
              <span className="!pt-1">-1</span>
            </Button>
          </div>
          <div className="flex gap-2 justify-center pt-5 sm:pt-10">
            <Button variant="contained" onClick={saveRecord}>
              <span className="!pt-1">적용</span>
            </Button>
            <Button variant="outlined" onClick={cancelRecord}>
              <span className="!pt-1">취소</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
