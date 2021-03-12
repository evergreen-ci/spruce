import { useMutation } from "@apollo/client";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/icons/Icon";
import { useToastContext } from "context/toast";
import {
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables,
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables,
} from "gql/generated/types";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";

const { green, gray } = uiColors;

export const FavoriteStar = ({ identifier, isFavorite }) => {
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
    onCompleted(data) {
      const { removeFavoriteProject: project } = data;
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
    <IconButton aria-label="Add To Favorites" onClick={onClick}>
      <Icon glyph="Favorite" fill={isFavorite ? green.dark2 : gray.light2} />
    </IconButton>
  );
};
