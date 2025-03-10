import {
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  SwipeableDrawer,
  Tab,
  Tabs,
} from "@mui/material";
import { WiseSying } from "../components/WiseSaying";
import { useMemo, useState } from "react";
import { useNoticeSnackbarStatus } from "../components/NoticeSnackbar";
import { RecordModal, useRecordModalStatus } from "../components/RecordModal";
import { useNavigate } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { useRecordStatus } from "../hooks";
import { persistAtomCommon } from "../atoms";

function RecordListItem({ record, drawer }) {
  const wiseSayingIndex = record.id % 5 === 0 ? record.id : null;
  return (
    <>
      <li>
        <div className="flex gap-1 select-none">
          <Chip
            label={`${record.id}회차`}
            variant="outlined"
            className="!pt-1"
          />
          <Chip
            label={new Date(record.regDate).toLocaleString()}
            variant="outlined"
            className="!pt-1"
            color="primary"
          />
        </div>
        <div className="flex !rounded-2xl shadow mb-5 sm:mb-10 mt-2 sm:mt-5">
          <div className="px-5 flex-grow whitespace-pre-wrap leading-loose !my-3 flex items-center select-none text-[14px] sm:text-[16px]">
            {record.count}회 수행
            {wiseSayingIndex && (
              <>
                <br />
                <br />
                <WiseSying wiseSayingIndex={wiseSayingIndex} />
              </>
            )}
          </div>

          <Button
            className="!rounded-r-2xl flex-shrink-0 flex !items-start"
            color="inherit"
            onClick={() => drawer.open(record.id)}
          >
            <span className="text-2xl sm:text-3xl h-[60px] sm:h-[80px] flex items-center text-[#dcdcdc]">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </span>
          </Button>
        </div>
      </li>
    </>
  );
}

function useDrawerStatus() {
  const [openedId, setOpenedId] = useState(null);
  const opened = useMemo(() => openedId !== null, [openedId]);

  const open = (id) => {
    setOpenedId(id);
  };

  const close = () => {
    setOpenedId(null);
  };

  return {
    openedId,
    opened,
    open,
    close,
  };
}

function Drawer({ status }) {
  const noticeSnackbarStatus = useNoticeSnackbarStatus();
  const recordStatus = useRecordStatus();
  const recordModalStatus = useRecordModalStatus();

  const deleteBtn = () => {
    if (window.confirm(`${status.openedId}회차 기록을 삭제해도 괜찮을까요?`)) {
      recordStatus.deleteRecord(Number(status.openedId));
      noticeSnackbarStatus.open(
        `${status.openedId}회차 기록이 삭제되었습니다.`
      );
    }
    status.close();
  };

  return (
    <>
      <RecordModifyModal
        onClose={status.close}
        id={status.openedId}
        recordModalStatus={recordModalStatus}
        status={status}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={status.opened}
        onClose={status.close}
        onOpen={status.open}
      >
        <List>
          <ListItem className="flex gap-2">
            <span className="text-[color:var(--mui-color-primary-main)]">
              {status.openedId}회차
            </span>
          </ListItem>
          <Divider />
          <ListItem button onClick={deleteBtn}>
            <span className="pt-2">삭제</span>
          </ListItem>
          <ListItem button onClick={recordModalStatus.open}>
            <span className="pt-2">수정</span>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function RecordModifyModal({ onClose, id, recordModalStatus, status }) {
  const noticeSnackbarStatus = useNoticeSnackbarStatus();
  const recordStatus = useRecordStatus();

  const modifyRecord = (recordeCount) => {
    recordStatus.modifyRecord(id, recordeCount);
    noticeSnackbarStatus.open(
      `${id}회차 스쿼트 횟수가 ${recordeCount}번으로 수정되었습니다.`
    );
    status.close();
  };

  return (
    <>
      <RecordModal
        recordModalStatus={recordModalStatus}
        msg={`${id}회차 스쿼트 횟수를 몇 회로 수정하시겠습니까?`}
        initialCount={recordStatus.findCountById(id)}
        saveRecord={modifyRecord}
        cancelRecord={onClose}
      />
    </>
  );
}

export const List__sortIndexAtom = atom({
  key: "app/List__sortIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

function History() {
  const recordStatus = useRecordStatus();
  const drawerStatus = useDrawerStatus();
  const navigate = useNavigate();

  const [sortIndex, setSortIndex] = useRecoilState(List__sortIndexAtom);

  const sortedRecords = useMemo(
    () =>
      [...recordStatus.savedRecords].sort((a, b) => {
        const regDateA = new Date(a.regDate).getTime();
        const regDateB = new Date(b.regDate).getTime();
        const countA = a.count;
        const countB = b.count;

        return sortIndex === 0
          ? regDateB - regDateA
          : sortIndex === 1
          ? regDateA - regDateB
          : sortIndex === 2
          ? countB - countA
          : countA - countB;
      }),
    [sortIndex, recordStatus.savedRecords]
  );

  if (recordStatus.savedRecords.length === 0) {
    return (
      <>
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[color:var(--mui-color-primary-main)]">
                기록
              </span>
              이 없습니다.
            </div>
            <Button variant="contained" onClick={() => navigate(-1)}>
              <span className="pt-1">기록하기</span>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Drawer status={drawerStatus} />
      <Tabs
        variant="scrollable"
        value={sortIndex}
        onChange={(event, newValue) => {
          setSortIndex(newValue);
        }}
      >
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">날짜순</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={0}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">날짜순</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={1}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-arrow-down-9-1"></i>
              <span className="mr-2 whitespace-nowrap">기록순</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={2}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-arrow-up-1-9"></i>
              <span className="mr-2 whitespace-nowrap">기록순</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={3}
        />
      </Tabs>
      <div className="flex-1 flex justify-center">
        <ul className="flex-1 p-5 sm:p-10">
          {sortedRecords.map((el, index) => (
            <RecordListItem key={index} record={el} drawer={drawerStatus} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default History;
