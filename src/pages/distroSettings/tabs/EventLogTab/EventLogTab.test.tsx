import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  DistroEventsQuery,
  DistroEventsQueryVariables,
} from "gql/generated/types";
import { DISTRO_EVENTS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { EventLogTab } from "./EventLogTab";

const Wrapper = ({ children, mocks = [query()] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("loading events", () => {
  it("does not show a load more button when the event count is less than the limit", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper>
        <EventLogTab />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/distro/rhel71-power8-large/settings",
      path: "/distro/:distroId/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(2);
    });
    expect(screen.queryByDataCy("load-more-button")).not.toBeInTheDocument();
    expect(screen.getByText("No more events to show.")).toBeInTheDocument();
  });

  it("shows a 'Load more' button when the number of events loaded meets the limit", async () => {
    const limit = 2;
    const { Component } = RenderFakeToastContext(
      <Wrapper mocks={[query(limit)]}>
        <EventLogTab limit={limit} />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/distro/rhel71-power8-large/settings",
      path: "/distro/:distroId/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(2);
    });
    expect(screen.getByDataCy("load-more-button")).toBeInTheDocument();
    expect(
      screen.queryByText("No more events to show."),
    ).not.toBeInTheDocument();
  });

  it("shows a legacy event entry for event lacking before and after fields", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper>
        <EventLogTab />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/distro/rhel71-power8-large/settings",
      path: "/distro/:distroId/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(2);
    });
    expect(screen.queryAllByDataCy("event-diff-table")).toHaveLength(1);
    expect(screen.queryAllByDataCy("legacy-event")).toHaveLength(1);
  });
});

const query = (
  limit: number = 15,
): ApolloMock<DistroEventsQuery, DistroEventsQueryVariables> => ({
  request: {
    query: DISTRO_EVENTS,
    variables: {
      distroId: "rhel71-power8-large",
      limit,
    },
  },
  result: {
    data: distroEvents,
  },
});

const distroEvents: DistroEventsQuery = {
  distroEvents: {
    count: 2,
    eventLogEntries: [
      {
        after: {
          _id: "rhel71-power8-large",
          arch: "linux_ppc64le",
          bootstrap_settings: {
            client_dir: "/home/mci-exec/evergreen_provisioning",
            communication: "rpc",
            env: [
              {
                key: "foo",
                value: "bar",
              },
            ],
            jasper_binary_dir: "/home/mci-exec/evergreen_provisioning",
            jasper_credentials_path:
              "/home/mci-exec/evergreen_provisioning/jasper_credentials.json",
            method: "ssh",
            resource_limits: {
              locked_memory: -1,
              num_files: 66000,
              num_processes: -1,
              virtual_memory: -1,
            },
            root_dir: "C:/cygwin",
            shell_path: "/bin/fish",
          },
          clone_method: "legacy-ssh",
          disable_shallow_clone: true,
          disabled: true,
          dispatcher_settings: {
            version: "revised-with-dependencies",
          },
          expansions: [
            {
              key: "decompress",
              value: "tar xzvf",
            },
            {
              key: "ps",
              value: "ps aux",
            },
          ],
          finder_settings: {
            version: "legacy",
          },
          home_volume_settings: {
            format_command: "",
          },
          host_allocator_settings: {
            acceptable_host_idle_time: 30000000000,
            feedback_rule: "",
            future_host_fraction: 0,
            hosts_overallocated_rule: "",
            maximum_hosts: 1,
            minimum_hosts: 0,
            rounding_rule: "",
            version: "utilization",
          },
          is_cluster: true,
          is_virtual_workstation: false,
          note: "This is an updated note",
          planner_settings: {
            commit_queue_factor: 0,
            expected_runtime_factor: 0,
            generate_task_factor: 0,
            group_versions: false,
            mainline_time_in_queue_factor: 0,
            patch_time_in_queue_factor: 0,
            patch_zipper_factor: 0,
            stepback_task_factor: 0,
            tartime: 0,
            version: "tunable",
          },
          provider: "ec2-ondemand",
          provider_settings_list: [
            {
              ami: "who-ami2",
              instance_type: "m4.4xlarge",
              is_vpc: false,
              region: "us-east-1",
              security_group_ids: ["1"],
              subnet_id: "subnet-123",
            },
            {
              ami: "who-ami-2",
              instance_type: "m4.2xlarge",
              is_vpc: false,
              region: "us-west-1",
              security_group_ids: ["2"],
            },
          ],
          setup: "ls -alF",
          setup_as_sudo: true,
          spawn_allowed: false,
          ssh_key: "mci",
          ssh_options: [
            "StrictHostKeyChecking=no",
            "BatchMode=yes",
            "ConnectTimeout=10",
          ],
          user: "mci-exec",
          work_dir: "/data/mci/hi/again/haaa/!!!",
        },
        before: {
          _id: "rhel71-power8-large",
          arch: "linux_ppc64le",
          bootstrap_settings: {
            client_dir: "/home/mci-exec/evergreen_provisioning",
            communication: "rpc",
            env: [
              {
                key: "foo",
                value: "bar",
              },
            ],
            jasper_binary_dir: "/home/mci-exec/evergreen_provisioning",
            jasper_credentials_path:
              "/home/mci-exec/evergreen_provisioning/jasper_credentials.json",
            method: "ssh",
            resource_limits: {
              locked_memory: -1,
              num_files: 66000,
              num_processes: -1,
              virtual_memory: -1,
            },
            root_dir: "C:/cygwin",
            shell_path: "/bin/fish",
          },
          clone_method: "legacy-ssh",
          disable_shallow_clone: true,
          disabled: true,
          dispatcher_settings: {
            version: "revised-with-dependencies",
          },
          expansions: [
            {
              key: "decompress",
              value: "tar xzvf",
            },
            {
              key: "ps",
              value: "ps aux",
            },
          ],
          finder_settings: {
            version: "legacy",
          },
          home_volume_settings: {
            format_command: "",
          },
          host_allocator_settings: {
            acceptable_host_idle_time: 30000000000,
            feedback_rule: "",
            future_host_fraction: 0,
            hosts_overallocated_rule: "",
            maximum_hosts: 1,
            minimum_hosts: 0,
            rounding_rule: "",
            version: "utilization",
          },
          is_cluster: true,
          is_virtual_workstation: false,
          note: "This is an updated note",
          planner_settings: {
            commit_queue_factor: 0,
            expected_runtime_factor: 0,
            generate_task_factor: 0,
            group_versions: false,
            mainline_time_in_queue_factor: 0,
            patch_time_in_queue_factor: 0,
            patch_zipper_factor: 0,
            stepback_task_factor: 0,
            tartime: 0,
            version: "tunable",
          },
          provider: "ec2-ondemand",
          provider_settings_list: [
            {
              ami: "who-ami",
              instance_type: "m4.4xlarge",
              is_vpc: false,
              region: "us-east-1",
              security_group_ids: ["1"],
              subnet_id: "subnet-123",
            },
            {
              ami: "who-ami-2",
              instance_type: "m4.2xlarge",
              is_vpc: false,
              region: "us-west-1",
              security_group_ids: ["2"],
            },
          ],
          setup: "ls -alF",
          setup_as_sudo: true,
          spawn_allowed: false,
          ssh_key: "mci",
          ssh_options: [
            "StrictHostKeyChecking=no",
            "BatchMode=yes",
            "ConnectTimeout=10",
          ],
          user: "mci-exec",
          work_dir: "/data/mci/hi/again/haaa/!!!",
        },
        data: {
          _id: "rhel71-power8-large",
          arch: "linux_ppc64le",
          bootstrap_settings: {
            client_dir: "/home/mci-exec/evergreen_provisioning",
            communication: "rpc",
            env: [
              {
                key: "foo",
                value: "bar",
              },
            ],
            jasper_binary_dir: "/home/mci-exec/evergreen_provisioning",
            jasper_credentials_path:
              "/home/mci-exec/evergreen_provisioning/jasper_credentials.json",
            method: "ssh",
            resource_limits: {
              locked_memory: -1,
              num_files: 66000,
              num_processes: -1,
              virtual_memory: -1,
            },
            root_dir: "C:/cygwin",
            shell_path: "/bin/fish",
          },
          clone_method: "legacy-ssh",
          disable_shallow_clone: true,
          disabled: true,
          dispatcher_settings: {
            version: "revised-with-dependencies",
          },
          expansions: [
            {
              key: "decompress",
              value: "tar xzvf",
            },
            {
              key: "ps",
              value: "ps aux",
            },
          ],
          finder_settings: {
            version: "legacy",
          },
          home_volume_settings: {
            format_command: "",
          },
          host_allocator_settings: {
            acceptable_host_idle_time: 30000000000,
            feedback_rule: "",
            future_host_fraction: 0,
            hosts_overallocated_rule: "",
            maximum_hosts: 1,
            minimum_hosts: 0,
            rounding_rule: "",
            version: "utilization",
          },
          is_cluster: true,
          is_virtual_workstation: false,
          note: "This is an updated note",
          planner_settings: {
            commit_queue_factor: 0,
            expected_runtime_factor: 0,
            generate_task_factor: 0,
            group_versions: false,
            mainline_time_in_queue_factor: 0,
            patch_time_in_queue_factor: 0,
            patch_zipper_factor: 0,
            stepback_task_factor: 0,
            tartime: 0,
            version: "tunable",
          },
          provider: "ec2-ondemand",
          provider_settings_list: [
            {
              ami: "who-ami2",
              instance_type: "m4.4xlarge",
              is_vpc: false,
              region: "us-east-1",
              security_group_ids: ["1"],
              subnet_id: "subnet-123",
            },
            {
              ami: "who-ami-2",
              instance_type: "m4.2xlarge",
              is_vpc: false,
              region: "us-west-1",
              security_group_ids: ["2"],
            },
          ],
          setup: "ls -alF",
          setup_as_sudo: true,
          spawn_allowed: false,
          ssh_key: "mci",
          ssh_options: [
            "StrictHostKeyChecking=no",
            "BatchMode=yes",
            "ConnectTimeout=10",
          ],
          user: "mci-exec",
          work_dir: "/data/mci/hi/again/haaa/!!!",
        },
        timestamp: new Date("2023-08-10T12:57:32.566-04:00"),
        user: "admin",
        __typename: "DistroEvent",
      },
      {
        after: null,
        before: null,
        data: {
          _id: "rhel71-power8-large",
          arch: "linux_ppc64le",
          bootstrap_settings: {
            client_dir: "/home/mci-exec/evergreen_provisioning",
            communication: "rpc",
            env: [
              {
                key: "foo",
                value: "bar",
              },
            ],
            jasper_binary_dir: "/home/mci-exec/evergreen_provisioning",
            jasper_credentials_path:
              "/home/mci-exec/evergreen_provisioning/jasper_credentials.json",
            method: "ssh",
            resource_limits: {
              locked_memory: -1,
              num_files: 66000,
              num_processes: -1,
              virtual_memory: -1,
            },
            root_dir: "C:/cygwin",
            shell_path: "/bin/fish",
          },
          clone_method: "legacy-ssh",
          disable_shallow_clone: true,
          disabled: true,
          dispatcher_settings: {
            version: "revised-with-dependencies",
          },
          expansions: [
            {
              key: "decompress",
              value: "tar xzvf",
            },
            {
              key: "ps",
              value: "ps aux",
            },
          ],
          finder_settings: {
            version: "legacy",
          },
          home_volume_settings: {
            format_command: "",
          },
          host_allocator_settings: {
            acceptable_host_idle_time: 30000000000,
            feedback_rule: "",
            future_host_fraction: 0,
            hosts_overallocated_rule: "",
            maximum_hosts: 1,
            minimum_hosts: 0,
            rounding_rule: "",
            version: "utilization",
          },
          is_cluster: true,
          is_virtual_workstation: false,
          note: "This is an updated note",
          planner_settings: {
            commit_queue_factor: 0,
            expected_runtime_factor: 0,
            generate_task_factor: 0,
            group_versions: false,
            mainline_time_in_queue_factor: 0,
            patch_time_in_queue_factor: 0,
            patch_zipper_factor: 0,
            stepback_task_factor: 0,
            tartime: 0,
            version: "tunable",
          },
          provider: "ec2-ondemand",
          provider_settings_list: [
            {
              ami: "who-ami",
              instance_type: "m4.4xlarge",
              is_vpc: false,
              region: "us-east-1",
              security_group_ids: ["1"],
              subnet_id: "subnet-123",
            },
            {
              ami: "who-ami-2",
              instance_type: "m4.2xlarge",
              is_vpc: false,
              region: "us-west-1",
              security_group_ids: ["2"],
            },
          ],
          setup: "ls -alF",
          setup_as_sudo: true,
          spawn_allowed: false,
          ssh_key: "mci",
          ssh_options: [
            "StrictHostKeyChecking=no",
            "BatchMode=yes",
            "ConnectTimeout=10",
          ],
          user: "mci-exec",
          work_dir: "/data/mci/hi/again/haaa/!!!",
        },
        timestamp: new Date("2023-08-09T17:00:06.819-04:00"),
        user: "admin",
        __typename: "DistroEvent",
      },
    ],
    __typename: "DistroEventsPayload",
  },
};
