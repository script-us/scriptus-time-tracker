import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useProjectVersions from "../../hooks/useProjectVersions";
import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import { TAccount, TIssue, TReference } from "../../types/redmine";
import { getGroupedIssues, getSortedIssues } from "../../utils/issue";
import Issue from "./Issue";
import { IssueTimerData } from "./IssueTimer";
import VersionTooltip from "./VersionTooltip";
import CreateTimeEntryModal from "./CreateTimeEntryModal";

type IssueData = IssueTimerData & {
  pinned: boolean;
  remembered: boolean;
};

export type IssuesData = Record<number, IssueData>;

type PropTypes = {
  account?: TAccount;
  issues: TIssue[];
  issuePriorities: ReturnType<typeof useIssuePriorities>;
  projectVersions?: ReturnType<typeof useProjectVersions>;
  issuesData: ReturnType<typeof useStorage<IssuesData>>;
  onSearchInProject?: (project: TReference) => void;
};

const IssuesList = ({ account, issues: rawIssues, issuePriorities, projectVersions, issuesData: { data: issuesData, setData: setIssuesData }, onSearchInProject }: PropTypes) => {
  const { settings } = useSettings();
  const [isPause, setIsPause] = useState(false);
  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);
  const [currentIssue, setCurrentIssue] = useState<TIssue | null>(null);
  const [manualData, setManualData] = useState<TIssue | null>(null);
  const groupedIssues = getGroupedIssues(getSortedIssues(rawIssues, settings.style.sortIssuesByPriority ? issuePriorities.data : [], issuesData), projectVersions?.data ?? {}, issuesData, settings);

  const handleReset = (issue: TIssue) => {
    const data = issuesData?.[issue?.id] ?? {
      active: false,
      start: undefined,
      time: 0,
      pinned: false,
      remembered: false,
    };

    const newIssuesData = {
      ...issuesData,
      [issue.id]: {
        ...data,
        active: false,
        start: undefined,
        time: 0,
        pinned: false,
      },
    };

    if (!data.pinned && !data.remembered) {
      delete newIssuesData[issue.id];
    }

    setIssuesData(newIssuesData);
  };
  return (
    <>
      {groupedIssues?.map(({ project, versions, groups }, index) => {
        return (
          <Fragment key={`issue-${index}`}>
            <Accordion
              sx={{
                borderRadius: "0px",
                marginTop: "15px",
                border: "0.5px solid lightgrey",
                "@media (prefers-color-scheme: dark)": {
                  backgroundColor: "#1F1F1F",
                  border: "2px solid #1d4ed8",
                  color: "white",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ "@media (prefers-color-scheme: dark)": { color: "white" }, color: "black" }} />}
                aria-controls={`panel-content-${index}`}
                id={`panel-header-${index}`}
                className={clsx({
                  "sticky top-0 z-[5] -mx-2 -my-1 bg-background px-2 py-1": settings.style.stickyScroll,
                })}
              >
                <div style={{ flex: "1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography className="max-w-fit truncate text-xl">
                    <a href={`${settings.redmineURL}/projects/${project?.id}`} target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
                      {project?.name}
                    </a>
                  </Typography>
                  {onSearchInProject && (
                    <button type="button" onClick={() => onSearchInProject(project as TReference)} tabIndex={-1} className="mr-3">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ "@media (prefers-color-scheme: dark)": { backgroundColor: "#1F1F1F" }, padding: "0px 7px 16px" }}>
                {groups?.map(({ type, version, issues }, index) => (
                  <Fragment key={index}>
                    {settings.style.groupIssuesByVersion && versions.length > 0 && ["version", "no-version"].includes(type) && (
                      <>
                        {version && <VersionTooltip version={version} />}
                        <div
                          className={clsx({
                            "shadow- sticky top-6 z-[5] -mx-2 -my-1 bg-background px-2 py-1 shadow shadow-background": settings.style.stickyScroll,
                          })}
                        >
                          <span
                            className="w-fit truncate rounded bg-background-inner px-1.5 text-xs text-gray-950 dark:text-gray-300"
                            data-tooltip-id={`tooltip-version-${version?.id}`}
                            style={{ fontSize: "18px" }}
                          >
                            {type === "version" && version && (
                              <a href={`${settings.redmineURL}/versions/${version.id}`} target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
                                {version.name}
                              </a>
                            )}
                            {type === "no-version" && <FormattedMessage id="issues.version.no-version" />}
                          </span>
                        </div>
                      </>
                    )}

                    {issues?.map((issue) => {
                      const data: IssueData = issuesData?.[issue?.id] ?? {
                        active: false,
                        start: undefined,
                        time: 0,
                        pinned: false,
                        remembered: false,
                      };
                      return (
                        <>
                          <div className="p-2">
                            <Issue
                              setIsPause={setIsPause}
                              isPause={isPause}
                              createTimeEntry={createTimeEntry}
                              setCreateTimeEntry={setCreateTimeEntry}
                              key={issue?.id}
                              issue={issue}
                              priorityType={issuePriorities?.getPriorityType(issue)}
                              timerData={{ active: data.active, start: data.start, time: data.time }}
                              assignedToMe={account ? account.id === issue.assigned_to?.id : true}
                              pinned={data.pinned}
                              remembered={data.remembered}
                              onStart={() => {
                                setIssuesData({
                                  ...(settings.features.autoPauseOnSwitch
                                    ? Object.entries(issuesData).reduce((res: IssuesData, [id, val]) => {
                                        res[Number(id)] = val.active
                                          ? {
                                              ...val,
                                              active: false,
                                              start: undefined,
                                              time: calcTime(val.time, val.start),
                                            }
                                          : val;
                                        return res;
                                      }, {})
                                    : issuesData),
                                  [issue.id]: {
                                    ...data,
                                    active: true,
                                    start: new Date().getTime(),
                                    time: data.time,
                                    pinned: settings.style.pinTrackedIssues,
                                  },
                                });
                              }}
                              onPause={(time) => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    active: false,
                                    start: undefined,
                                    time: time,
                                  },
                                });
                                setCurrentIssue(issue);
                              }}
                              onReset={() => {
                                const newIssuesData = {
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    active: false,
                                    start: undefined,
                                    time: 0,
                                    pinned: false,
                                  },
                                };
                                if (!data.pinned && !data.remembered) {
                                  delete newIssuesData[issue.id];
                                }
                                setIssuesData(newIssuesData);
                              }}
                              onOverrideTime={(time) => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    time: time,
                                    ...(data.active
                                      ? {
                                          start: new Date().getTime(),
                                        }
                                      : {}),
                                  },
                                });
                              }}
                              onRemember={() => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    remembered: true,
                                  },
                                });
                              }}
                              onForget={() => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    remembered: false,
                                  },
                                });
                              }}
                              onPin={() => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    pinned: true,
                                  },
                                });
                              }}
                              onUnpin={() => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    pinned: false,
                                  },
                                });
                              }}
                              onPinAndRemember={() => {
                                setIssuesData({
                                  ...issuesData,
                                  [issue.id]: {
                                    ...data,
                                    pinned: true,
                                    remembered: true,
                                  },
                                });
                              }}
                              onAddManually={() => {
                                setManualData(issue);
                              }}
                              currentIssue={manualData as TIssue}
                            />
                          </div>
                        </>
                      );
                    })}
                  </Fragment>
                ))}
              </AccordionDetails>
            </Accordion>
          </Fragment>
        );
      })}
      {groupedIssues.length === 0 && (
        <p className="text-center">
          <FormattedMessage id="issues.list.no-issues" />
        </p>
      )}
      {isPause && createTimeEntry !== undefined ? (
        <CreateTimeEntryModal
          isPause={isPause}
          issue={currentIssue as TIssue}
          time={Number(createTimeEntry)}
          onClose={() => {
            setIsPause(false);
            setCreateTimeEntry(undefined);
          }}
          onSuccess={() => {
            setCreateTimeEntry(undefined);
            handleReset(currentIssue as TIssue);
          }}
        />
      ) : null}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default IssuesList;
