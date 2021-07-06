import { useQuery, useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GetDisplayTaskQuery, GetDisplayTaskQueryVariables, GetTestsQuery, GetTestsQueryVariables } from "gql/generated/types"
import { GET_DISPLAY_TASK, GET_TESTS } from "gql/queries"

export const TestLogs = () => {
	const { taskId, execution, groupId } = useParams<{ taskId: string, execution: string, groupId: string }>();
	const {
		data: getDisplayTaskResult,
		loading: getDisplayTaskLoading
	} = useQuery<GetDisplayTaskQuery, GetDisplayTaskQueryVariables>(
		GET_DISPLAY_TASK,
		{
			variables: {
				taskId,
				execution: parseInt(execution)
			}
		});
	const [
		getTests,
		{
			loading: getTestsLoading,
			data: getTestsResult
		}
	] = useLazyQuery<GetTestsQuery, GetTestsQueryVariables>(GET_TESTS);

	useEffect(() => {
		if(getDisplayTaskResult?.data.)
	}, [getDisplayTaskResult])
	return (<div>test logs</div>);
}
