import { Button } from "@mui/material";
import { CountNumber } from "../components/CountUp";
import { useNoticeSnackbarStatus } from "../components/NoticeSnackbar";
import { RecordModal, useRecordModalStatus } from "../components/RecordModal";
import { useRecordStatus } from "../hooks";

function RecordAddModal({ recordModalStatus }) {
  const noticeSnackbarStatus = useNoticeSnackbarStatus();
  const recordStatus = useRecordStatus();

  const saveRecord = (recordCount) => {
    recordStatus.saveRecord(recordCount);
    if (recordCount === 0) return;
    noticeSnackbarStatus.open(
      `이번 세트에서 ${recordCount}회 완료하셨습니다!👏👏`
    );
  };

  return (
    <>
      <RecordModal
        recordModalStatus={recordModalStatus}
        msg="이번 세트의 스쿼트 기록을 남겨주세요!"
        saveRecord={saveRecord}
        initialCount={0}
      />
    </>
  );
}

function Main() {
  const recordStatus = useRecordStatus();
  const recordModalStatus = useRecordModalStatus();

  return (
    <>
      <RecordAddModal recordModalStatus={recordModalStatus} />
      <div className="flex-1 flex justify-center items-center flex-col select-none">
        <div className="text-[80px] sm:text-[100px] text-[color:var(--mui-color-primary-main)] font-mono">
          <CountNumber
            start={recordStatus.goalCount}
            end={recordStatus.restCount}
            duration={1}
          />
        </div>
        <div>
          <Button variant="contained" onClick={recordModalStatus.open}>
            <span className="!pt-1">기록하기</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Main;
