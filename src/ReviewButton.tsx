import React from "react";

import { GROWI } from "@goofmint/growi-js";
import { Properties } from "hastscript";
import type { Plugin } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";

declare const growiFacade: {
  react: typeof React;
};

type Webhook = {
  feedbackMessage: string;
};

export const reviewButton = (
  Tag: React.FunctionComponent<any>
): React.FunctionComponent<any> => {
  return ({ children, ...props }) => {
    try {
      const { react } = growiFacade;
      const { useState } = react;
      const [feedbackMessage, setFeedbackMessage] = useState<Webhook | null>(
        null
      );
      const [buttonDisabled, setButtonDisabled] = useState(false);
      const { node } = props;
      const { webhookUrl, ...params } = JSON.parse(node.properties.title);
      const handleClick = () => {
        setButtonDisabled(true);
      };

      if (!params.reviewButton) {
        return <Tag {...props}>{children}</Tag>;
      }
      if (!webhookUrl) {
        return (
          <>
            <div className="alert alert-danger" role="alert">
              <code>webhookUrl</code>
              <text> is required</text>
            </div>
          </>
        );
      }
      if (!params.webhookSignature) {
        return (
          <>
            <div className="alert alert-danger" role="alert">
              <code>webhookSignature</code>
              <text> is required</text>
            </div>
          </>
        );
      }
      if (!params.repoOwner) {
        return (
          <>
            <div className="alert alert-danger" role="alert">
              <code>repoOwner</code>
              <text> is required</text>
            </div>
          </>
        );
      }
      if (!params.repo) {
        return (
          <>
            <div className="alert alert-danger" role="alert">
              <code>repo</code>
              <text> is required</text>
            </div>
          </>
        );
      }
      const growi = new GROWI();
      const getPageId = () => {
        const pageId = window.location.pathname.replace(/\//, "");
        return pageId;
      };

      const getPageData = async (pageId: string, type: string) => {
        const page = await growi.page({ pageId });
        const pageData = {
          type,
          id: page.id,
          title: page.path?.substring(page.path?.lastIndexOf("/") + 1),
          revision: {
            id: page.revision?.id,
            author: {
              id: page.lastUpdateUser?.id,
              email: page.lastUpdateUser?.email,
              name: page.lastUpdateUser?.name,
            },
            createdAt: page.revision?.createdAt,
            body: page.revision?.body,
          },
        };

        return pageData;
      };

      const getWebhookData = async (type: string) => {
        // Disables the button to prevent conflicts.
        // The client would have to refresh the document to use the button again.
        handleClick();
        const pageData = await getPageData(getPageId(), type);
        const webhookOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": params.webhookSignature,
          },
          body: JSON.stringify(pageData),
        };

        const url = webhookUrl;
        const response = await fetch(url, webhookOptions);
        const json = (await response.json()) as Webhook;

        setFeedbackMessage(json);
      };

      if (webhookUrl) {
        return (
          <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div
                className="container-fluid"
                style={{ justifyContent: "flex-start", gap: "5px" }}
              >
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Révision fonctionnelle
                  </button>
                  <ul
                    className="dropdown-menu"
                    style={{ paddingLeft: "unset" }}
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        disabled={buttonDisabled}
                        onClick={() => getWebhookData("fonctionnel")}
                        type="submit"
                      >
                        Demander une révision
                      </button>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        target="_blank"
                        style={{ borderBottom: "none" }}
                        href={`https://github.com/${params.repoOwner}/${
                          params.repo
                        }/pulls?q=is:pr label:fonctionnel head:${getPageId()}`}
                      >
                        Voir les révisions
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Révision tech
                  </button>
                  <ul
                    className="dropdown-menu"
                    style={{ paddingLeft: "unset" }}
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        disabled={buttonDisabled}
                        onClick={() => getWebhookData("tech")}
                        type="submit"
                      >
                        Demander une révision
                      </button>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        target="_blank"
                        style={{ borderBottom: "none" }}
                        href={`https://github.com/${params.repoOwner}/${
                          params.repo
                        }/pulls?q=is:pr label:tech head:${getPageId()}`}
                      >
                        Voir les révisions
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Révision gestion
                  </button>
                  <ul
                    className="dropdown-menu"
                    style={{ paddingLeft: "unset" }}
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        disabled={buttonDisabled}
                        onClick={() => getWebhookData("gestion")}
                        type="submit"
                      >
                        Demander une révision
                      </button>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        target="_blank"
                        style={{ borderBottom: "none" }}
                        href={`https://github.com/${params.repoOwner}/${
                          params.repo
                        }/pulls?q=is:pr label:gestion head:${getPageId()}`}
                      >
                        Voir les révisions
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            {feedbackMessage && (
              <div className="alert alert-primary" role="alert">
                <div
                  dangerouslySetInnerHTML={{
                    __html: feedbackMessage?.feedbackMessage,
                  }}
                />
              </div>
            )}
          </>
        );
      }
    } catch (err) {
      // console.error(err);
    }
    // Return the original component if an error occurs
    return <Tag {...props}>{children}</Tag>;
  };
};

interface GrowiNode extends Node {
  name: string;
  data: {
    hProperties?: Properties;
    hName?: string;
    hChildren?: Node[] | { type: string; value: string; url?: string }[];
    [key: string]: any;
  };
  type: string;
  attributes: { [key: string]: string };
  children: GrowiNode[] | { type: string; value: string; url?: string }[];
  value: string;
  title?: string;
  url?: string;
}

export const remarkPlugin: Plugin = () => {
  return (tree: Node) => {
    return visit(tree, "containerDirective", (node: Node) => {
      const n = node as unknown as GrowiNode;
      if (n.name !== "reviewButton") return;
      const data = n.data || (n.data = {});
      // Render your component
      const { value } = n.children[0] || { value: "" };
      data.hName = "a"; // Tag name
      data.hChildren = [{ type: "text", value }]; // Children
      // Set properties
      data.hProperties = {
        title: JSON.stringify({ ...n.attributes, ...{ reviewButton: true } }), // Pass to attributes to the component
      };
    });
  };
};
