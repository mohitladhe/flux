import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, UsersRound } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { LoadingPage } from "../components/LoadingPage";
import {
  getConversations,
  getGroupInvitePreview,
  joinGroupByInvite,
} from "../services/conversationService";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

export function GroupInvitePreviewPage() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setConversationList = useChatStore(
    (state) => state.setConversationList,
  );
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );
  const [previewResult, setPreviewResult] = useState({
    token: null,
    preview: null,
    error: "",
  });
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      return () => {
        cancelled = true;
      };
    }

    getGroupInvitePreview(token)
      .then((invitePreview) => {
        if (!cancelled) {
          setPreviewResult({ token, preview: invitePreview, error: "" });
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setPreviewResult({
            token,
            preview: null,
            error:
              requestError.response?.data?.message ||
              "This invite link is invalid, expired, or revoked.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  const loading =
    isAuthenticated && previewResult.token !== token;
  const preview =
    previewResult.token === token ? previewResult.preview : null;
  const previewError =
    previewResult.token === token ? previewResult.error : "";

  const handleJoinGroup = async () => {
    setJoining(true);
    setJoinError("");

    try {
      const result = await joinGroupByInvite(token);
      const conversations = await getConversations();
      setConversationList(conversations);

      const joinedConversation = conversations.find(
        (conversation) =>
          conversation._id?.toString() === result.groupId?.toString(),
      );

      if (!joinedConversation) {
        throw new Error("The group joined but could not be loaded.");
      }

      setActiveConversation(joinedConversation);
      navigate("/chat", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setJoinError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not join this group. Please try again.",
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return (
      <main className="app-root flex min-h-dvh items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border app-card-strong p-7 text-center shadow-2xl">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl app-chip">
            <UsersRound size={25} />
          </div>
          <h1 className="mt-5 text-2xl font-bold app-text">Group invitation</h1>
          <p className="mt-2 text-sm leading-6 app-muted">
            Sign in to preview this group and join the conversation.
          </p>
          <button
            type="button"
            onClick={() =>
              navigate("/", {
                state: { from: location.pathname },
                replace: true,
              })
            }
            className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
          >
            Sign in to continue
          </button>
        </section>
      </main>
    );
  }

  const avatar = preview?.groupAvatar || preview?.groupAvatarP;
  const isImageAvatar =
    typeof avatar === "string" &&
    /^(https?:\/\/|\/|data:image\/)/i.test(avatar);

  return (
    <main className="app-root flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border app-card-strong shadow-2xl">
        <header className="flex items-center justify-between border-b app-border px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid size-10 place-items-center rounded-xl transition app-icon-button"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>
          <p className="text-sm font-bold app-text">Group invitation</p>
          <span className="size-10" aria-hidden="true" />
        </header>

        {preview ? (
          <div className="p-7 text-center">
            {isImageAvatar ? (
              <img
                src={avatar}
                alt={`${preview.groupName} group`}
                className="mx-auto size-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="mx-auto w-fit">
                <Avatar
                  label={avatar || getInitials(preview.groupName)}
                  size="lg"
                />
              </div>
            )}

            <h1 className="mt-5 break-words text-2xl font-bold app-text">
              {preview.groupName}
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold app-chip">
              <UsersRound size={16} />
              {preview.memberCount}{" "}
              {preview.memberCount === 1 ? "member" : "members"}
            </div>

            <p className="mt-5 text-sm leading-6 app-muted">
              You have been invited to join this group.
            </p>

            {joinError && (
              <p role="alert" className="mt-4 text-sm text-red-500">
                {joinError}
              </p>
            )}

            <button
              type="button"
              onClick={handleJoinGroup}
              disabled={joining}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              {joining && <LoaderCircle size={17} className="animate-spin" />}
              {joining ? "Joining group…" : "Join group"}
            </button>
          </div>
        ) : (
          <div className="p-7 text-center">
            <h1 className="text-xl font-bold app-text">Invite unavailable</h1>
            <p role="alert" className="mt-3 text-sm leading-6 app-muted">
              {previewError ||
                "This invite link is invalid, expired, or revoked."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function getInitials(name = "Group") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "GC"
  );
}
