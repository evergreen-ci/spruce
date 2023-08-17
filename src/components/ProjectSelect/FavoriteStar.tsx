import { useMutation } from "@apollo/client";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { useToastContext } from "context/toast";
import {
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables,
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables,
} from "gql/generated/types";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";

const { gray, green } = palette;

interface FavoriteStarProps {
  identifier: string;
  isFavorite: boolean;
  ["data-cy"]?: string;
}
export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  "data-cy": dataCy,
  identifier,
  isFavorite,
}) => {
  const dispatchToast = useToastContext();

  const [addFavoriteProject] = useMutation<
    AddFavoriteProjectMutation,
    AddFavoriteProjectMutationVariables
  >(ADD_FAVORITE_PROJECT, {
    onCompleted(data) {
      const { addFavoriteProject: project } = data;
      dispatchToast.success(`Added ${project.displayName} to favorites!`);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const [removeFavoriteProject] = useMutation<
    RemoveFavoriteProjectMutation,
    RemoveFavoriteProjectMutationVariables
  >(REMOVE_FAVORITE_PROJECT, {
    onCompleted({ removeFavoriteProject: project }) {
      dispatchToast.success(`Removed ${project.displayName} from favorites!`);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavoriteProject({ variables: { identifier } });
    } else {
      addFavoriteProject({ variables: { identifier } });
    }
  };
  return (
    <IconButton
      aria-label="Add To Favorites"
      data-cy={dataCy}
      onClick={onClick}
    >
      <Icon glyph="Favorite" fill={isFavorite ? green.dark2 : gray.light2} />
    </IconButton>
  );
};
