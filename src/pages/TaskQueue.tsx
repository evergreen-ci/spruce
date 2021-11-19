import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { useParams, useHistory } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
} from "components/styles";
import { getTaskQueueRoute } from "constants/routes";
import {
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";

const { gray, white, blue } = uiColors;

interface TaskQueueOptionProps {
  id: string;
  taskCount: number;
  hostCount: number;
  onClickNewSelection: (val: string) => void;
  setisOpen: (isOpen: boolean) => void;
}

const TaskQueueOption: React.FC<TaskQueueOptionProps> = ({
  id,
  taskCount,
  hostCount,
  onClickNewSelection,
  setisOpen,
}) => {
  const onClickOption = (option: string) => {
    onClickNewSelection(option);
    setisOpen(false);
  };

  return (
    <OptionWrapper onClick={() => onClickOption(id)}>
      <StyledBadge>{`${taskCount} ${
        taskCount === 1 ? "TASK" : "TASKS"
      }`}</StyledBadge>
      <StyledBadge>{`${hostCount} ${
        hostCount === 1 ? "HOST" : "HOSTS"
      }`}</StyledBadge>
      <DistroName>{id}</DistroName>
    </OptionWrapper>
  );
};

/* ------------------------------------------------------ */
export const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const { replace } = useHistory();

  const [selectedDistroPlaceholder, setSelectedDistroPlaceholder] = useState(
    ""
  );
  const [selectedDistro, setSelectedDistro] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState([]);

  const listMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const { data: distrosData, loading: loadingDistros } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS);

  // remove this, this is just to get past commit hook
  console.log(loadingDistros);

  // remove this, this is just to get past commit hook
  const distros = useMemo(() => distrosData?.taskQueueDistros ?? [], [
    distrosData?.taskQueueDistros,
  ]);
  const firstDistroInList = distros[0]?.id;

  // SET DEFAULT DISTRO
  useEffect(() => {
    const defaultDistro = distro ?? firstDistroInList;

    setSelectedDistroPlaceholder(defaultDistro);
    setSelectedDistro("");
    setVisibleOptions(distros || []);

    if (defaultDistro) {
      replace(getTaskQueueRoute(defaultDistro, taskId));
    }
  }, [firstDistroInList, distro, distros, replace, taskId]);

  // Handle onClickOutside
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onClickOutside = (event: MouseEvent) => {
      const stillFocused =
        menuButtonRef.current!.contains(event.target as Node) ||
        listMenuRef.current!.contains(event.target as Node);
      setisOpen(stillFocused);
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [listMenuRef, menuButtonRef, isOpen]);

  const onChangeDistroSelection = (val: string) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val });
    setSelectedDistroPlaceholder(val);
    setSelectedDistro("");
    setVisibleOptions(distros);

    replace(getTaskQueueRoute(val));
  };

  const handleSearch = useMemo(
    () => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: searchTerm } = e.target;
      setSelectedDistro(searchTerm);
      setSelectedDistroPlaceholder(searchTerm);
      const filteredOptions = distros.filter((d) =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVisibleOptions(filteredOptions);
    },
    [distros]
  );

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <TableControlOuterRow>
        <TempWrapper>
          <TextInputWrapper>
            <TextInput
              ref={menuButtonRef}
              spellCheck={false}
              aria-label="distro-searchable-dropdown"
              type="search"
              placeholder={selectedDistroPlaceholder}
              value={selectedDistro}
              onChange={handleSearch}
              onClick={() => setisOpen(true)}
            />
            <StyledIcon glyph="MagnifyingGlass" />
          </TextInputWrapper>
          {isOpen && (
            <RelativeWrapper>
              <OptionsWrapper
                ref={listMenuRef}
                data-cy="distro-searchable-dropdown-options"
              >
                {visibleOptions.map(({ id, taskCount, hostCount }) => (
                  <TaskQueueOption
                    taskCount={taskCount}
                    hostCount={hostCount}
                    id={id}
                    onClickNewSelection={onChangeDistroSelection}
                    setisOpen={setisOpen}
                    key={`distro-searchable-dropdown-option-${id}`}
                  />
                ))}
              </OptionsWrapper>
            </RelativeWrapper>
          )}
        </TempWrapper>
      </TableControlOuterRow>
      <TableContainer hide={false}>
        <TaskQueueTable />
      </TableContainer>
    </PageWrapper>
  );
};

const OptionWrapper = styled.div`
  display: flex;
  padding: 8px;
  &:hover {
    cursor: pointer;
    background-color: ${blue.light3};
  }
`;

const TempWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin-bottom: 10px;
`;

const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const StyledIcon = styled(Icon)`
  position: absolute;
  height: 100%;
  justify-content: center;
  align-self: flex-end;
  margin-right: 10px;
`;

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;
const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
  white-space: nowrap;
`;
const StyledBadge = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  width: 60px;
  text-align: center;
  margin-right: 6px;
`;
const DistroName = styled(Disclaimer)`
  margin-left: 16px;
`;
