import { Route, Routes, Navigate } from "react-router-dom";
import {
  DistroSettingsRedirect,
  ProjectSettingsRedirect,
  UserPatchesRedirect,
  WaterfallCommitsRedirect,
} from "components/Redirects";
import { redirectRoutes, routes, slugs } from "constants/routes";
import { CommitQueue } from "pages/CommitQueue";
import { Commits } from "pages/Commits";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Container } from "pages/Container";
import { Distro } from "pages/Distro";
import { Host } from "pages/Host";
import { Hosts } from "pages/Hosts";
import { JobLogs } from "pages/JobLogs";
import { MyPatches } from "pages/MyPatches";
import { PageDoesNotExist } from "pages/NotFound";
import { Preferences } from "pages/Preferences";
import { ProjectPatches } from "pages/ProjectPatches";
import { ProjectSettings } from "pages/ProjectSettings";
import { Spawn } from "pages/Spawn";
import { Task } from "pages/Task";
import { TaskHistory } from "pages/TaskHistory";
import { TaskQueue } from "pages/TaskQueue";
import { UserPatches } from "pages/UserPatches";
import { VariantHistory } from "pages/VariantHistory";
import { VersionPage } from "pages/Version";
import { Layout } from "./Layout";

export const Content: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Navigate to={routes.myPatches} />} />
      <Route path={routes.commits} element={<Commits />}>
        <Route path={`:${slugs.projectIdentifier}`} element={null} />
      </Route>
      <Route path={routes.container} element={<Container />} />
      <Route
        path={redirectRoutes.waterfall}
        element={<WaterfallCommitsRedirect />}
      />
      <Route path={routes.configurePatch} element={<ConfigurePatch />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path={`${routes.distroSettings}/*`} element={<Distro />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route
        path={redirectRoutes.distroSettings}
        element={<DistroSettingsRedirect />}
      />
      <Route path={routes.host} element={<Host />} />
      <Route path={routes.hosts} element={<Hosts />} />
      <Route path={routes.jobLogs} element={<JobLogs />}>
        <Route path={`:${slugs.groupId}`} element={null} />
      </Route>
      <Route path={routes.myPatches} element={<MyPatches />} />
      <Route path={routes.patch} element={<VersionPage />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path={`${routes.preferences}/*`} element={<Preferences />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path={routes.projectPatches} element={<ProjectPatches />} />
      <Route path={`${routes.projectSettings}/*`} element={<ProjectSettings />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route
        path={redirectRoutes.projectSettings}
        element={<ProjectSettingsRedirect />}
      />
      <Route path={`${routes.spawn}/*`} element={<Spawn />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path={routes.commitQueue} element={<CommitQueue />} />
      <Route path={routes.task} element={<Task />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path={routes.taskHistory} element={<TaskHistory />} />
      <Route path={routes.taskQueue} element={<TaskQueue />}>
        <Route path={`:${slugs.distroId}`} element={null} />
      </Route>
      <Route path={routes.userPatches} element={<UserPatches />} />
      <Route
        path={redirectRoutes.userPatches}
        element={<UserPatchesRedirect />}
      />
      <Route path={routes.variantHistory} element={<VariantHistory />} />
      <Route path={routes.version} element={<VersionPage />}>
        <Route path={`:${slugs.tab}`} element={null} />
      </Route>
      <Route path="*" element={<PageDoesNotExist />} />
    </Route>
  </Routes>
);
