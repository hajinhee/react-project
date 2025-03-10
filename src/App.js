import {
  AppBar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  Modal,
  Alert as MuiAlert,
  Snackbar,
  SwipeableDrawer,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { CountUp } from "countup.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

// 유틸리티
const myConfetti = window.confetti.create(
  document.querySelector("#confetti-canvas"),
  {
    resize: true,
    useWorker: true,
  }
);

const { persistAtom: persistAtomCommon } = recoilPersist({
  key: "persistAtomCommon",
});

const { persistAtom: persistAtomRecords } = recoilPersist({
  key: "persistAtomRecords",
});

function getWiseSaying() {
  function getData() {
    const arr = window.wiseSayings.trim().split("\n");

    const data = [];

    arr.forEach((row, index) => {
      const [str, writer] = row.split("//");

      data.push({
        index,
        str,
        writer,
      });
    });

    return data;
  }

  function get(index) {
    index = index % data.length;

    return data[index];
  }

  const data = getData();

  return {
    get,
  };
}

const wiseSaying = getWiseSaying();

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert {...props} ref={ref} />;
});

const noticeSnackbarInfoAtom = atom({
  key: "app/noticeSnackbarInfoAtom",
  default: {},
});

const doneCountAtom = atom({
  key: "app/doneCountAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

const savedRecordsAtom = atom({
  key: "app/savedRecordsAtom",
  default: [],
  effects_UNSTABLE: [persistAtomRecords],
});

const todosCountAtom = atom({
  key: "app/todosCountAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

const TodoList__sortIndexAtom = atom({
  key: "app/TodoList__sortIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

function useRecordStatus() {
  const [doneCount, setDoneCount] = useRecoilState(doneCountAtom);
  const [savedRecords, setSavedRecords] = useRecoilState(savedRecordsAtom);
  const [todosCount, setTodosCount] = useRecoilState(todosCountAtom);

  const todosCountRef = useRef(todosCount);
  todosCountRef.current = todosCount;

  const goalCount = 1000;
  const restCount = goalCount - doneCount;

  const saveRecord = (count) => {
    if (count + doneCount > goalCount) count = goalCount - doneCount;
    if (count === 0) return;

    const id = ++todosCountRef.current;
    setTodosCount(id);
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

function useRecordModalStatus() {
  const [opened, setOpened] = useState(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return {
    opened,
    open,
    close,
  };
}

function useNoticeSnackbarStatus() {
  const [noticeSnackbarInfo, setNoticeSnackbarInfo] = useRecoilState(
    noticeSnackbarInfoAtom
  );

  const opened = noticeSnackbarInfo.opened;
  const autoHideDuration = noticeSnackbarInfo.autoHideDuration;
  const severity = noticeSnackbarInfo.severity;
  const msg = noticeSnackbarInfo.msg;

  const open = (msg, severity = "success", autoHideDuration = 6000) => {
    setNoticeSnackbarInfo({
      opened: true,
      msg,
      severity,
      autoHideDuration,
    });
  };

  const close = () => {
    setNoticeSnackbarInfo({
      ...noticeSnackbarInfo,
      opened: false,
    });
  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    severity,
    msg,
  };
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

function NoticeSnackbar() {
  const status = useNoticeSnackbarStatus();

  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.autoHideDuration}
        onClose={status.close}
      >
        <Alert severity={status.severity}>{status.msg}</Alert>
      </Snackbar>
    </>
  );
}

function CountNumber({ start, end, duration }) {
  const spanRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (countRef.current === null) {
      countRef.current = new CountUp(spanRef.current, end, {
        startVal: start,
        duration: duration,
        useGrouping: false,
        formattingFn: (n) => n.toString().padStart(5, "0"),
      });
      countRef.current.start();
    } else {
      countRef.current.update(end);
    }
  }, [duration, start, end]);

  return <div ref={spanRef}></div>;
}

function RecordModal({
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

function WiseSying({ wiseSayingIndex }) {
  const { str, writer } = wiseSaying.get(wiseSayingIndex);
  return (
    <>
      {str}
      <br />-{writer}-
    </>
  );
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

function MainPage() {
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

function HistoryPage() {
  const recordStatus = useRecordStatus();
  const drawerStatus = useDrawerStatus();
  const navigate = useNavigate();

  const [sortIndex, setSortIndex] = useRecoilState(TodoList__sortIndexAtom);

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

function App() {
  const location = useLocation();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-grow-0 sm:flex-1"></div>
          <NavLink
            to="/main"
            className="font-bold select-none cursor-pointer self-stretch flex items-center"
          >
            💪 Jini’s Squat Challenge! 💪
          </NavLink>
          <div className="flex-grow"></div>
          <div className="self-stretch flex items-center">
            {location.pathname !== "/history" && (
              <NavLink
                className="select-none select-none self-stretch flex items-center"
                to="/history"
              >
                히스토리
              </NavLink>
            )}
            {location.pathname === "/history" && (
              <NavLink
                className="select-none select-none self-stretch flex items-center"
                to="/main"
              >
                뒤로가기
              </NavLink>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackbar />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </>
  );
}

export default App;
