/**
 * `AZToRegion` takes an availability zone and returns its region name.
 * An AWS region is just the availability zone minus the final letter.
 * This rule is defined in evergreen:
 * https://github.com/evergreen-ci/evergreen/blob/299bf20c8da9e353b1097183672cd5169ff3447d/cloud/ec2_util.go#L76-L80
 * @param availabilityZone - the availability zone to convert
 * @returns the region name
 */
export const AZToRegion = (availabilityZone: string): string =>
  availabilityZone.slice(0, -1);
