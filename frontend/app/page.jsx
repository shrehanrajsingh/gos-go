"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    {
      type: "output",
      content: (
        <span>
          Welcome to <span className="text-[#50fa7b] underline">gOS</span> (go
          Online Shell)
          <br />
          This is a terminal interface to a social networking
          <br />
          application. Type 'help' for additional commands.
        </span>
      ),
    },
  ]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand();
    }
  };

  const processCommand = async () => {
    if (!input.trim()) return;

    const newHistory = [
      ...history,
      { type: "command", content: `user@system:~$ ${input}` },
    ];

    let inputSplit = [];
    let regex = /[^\s"]+|"([^"]*)"/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      if (match[1] !== undefined) {
        inputSplit.push(match[1]);
      } else {
        inputSplit.push(match[0]);
      }
    }

    const command = inputSplit[0].trim().toLowerCase();
    let output = "";

    switch (command) {
      case "help":
        if (inputSplit.length > 1) {
          let arg = inputSplit[1];

          switch (arg) {
            case "login":
              output = (
                <div>Usage: login -u &lt;username&gt; -p &lt;password&gt;</div>
              );
              break;
            case "signup":
              output = (
                <div>
                  Usage: signup -u &lt;username&gt; -p &lt;password&gt; -e
                  &lt;email&gt; -b &lt;bio/description&gt;
                </div>
              );
              break;
            default:
              break;
          }
        } else
          output = (
            <div>
              Available commands:
              <br />- help: Show this help message
              <br />- clear: Clear terminal
              <br />- date: Show current date
              <br />- ls: List files
              <br />- login: Login to your account. Type{" "}
              <code className="text-emerald-400">help login</code> for usage
              <br />- signup: Create a new account. Type{" "}
              <code className="text-emerald-400">help signup</code> for usage
              <br />- whoami: Check current logged in user
              <br />- logout: Logout from session
            </div>
          );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "date":
        output = new Date().toString();
        break;
      case "ls":
        output = (
          <div>
            ..
            <br />.
          </div>
        );
        break;
      case "login":
        {
          let m = {};
          let flag = "";
          for (let i = 1; i < inputSplit.length; i++) {
            let d = inputSplit[i];

            if (flag != "") {
              m[flag] = d;
              flag = "";
            }

            if (d[0] == "-") flag = d;
          }

          if (!m["-u"] || !m["-p"]) {
            output = (
              <div>Usage: login -u &lt;username&gt; -p &lt;password&gt;</div>
            );
          } else {
            try {
              const res = await fetch(`${apiBase}/signin`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: m["-u"],
                  password: m["-p"],
                }),
              });
              const data = await res.json();
              localStorage.setItem("gd-authtoken", data["token"]);
              output = <div>Logged in successfully.</div>;
            } catch (err) {
              output = (
                <div>{err && err.message ? err.message : String(err)}</div>
              );
            }
          }
        }

        break;
      case "signup":
        {
          let m = {};
          let flag = "";
          for (let i = 1; i < inputSplit.length; i++) {
            let d = inputSplit[i];

            if (flag != "") {
              m[flag] = d;
              flag = "";
            }

            if (d[0] == "-") flag = d;
          }

          if (!m["-u"] || !m["-e"] || !m["-p"] || !m["-b"]) {
            output = (
              <div>
                Usage: signup -u &lt;username&gt; -p &lt;password&gt; -e
                &lt;email&gt; -b &lt;bio/description&gt;
              </div>
            );
          } else {
            try {
              const res = await fetch(`${apiBase}/signup`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: m["-u"],
                  email: m["-e"],
                  password: m["-p"],
                  bio: m["-b"],
                }),
              });
              const data = await res.json();
              output = <div>{JSON.stringify(data)}</div>;
            } catch (err) {
              output = (
                <div>{err && err.message ? err.message : String(err)}</div>
              );
            }
          }
        }

        // output = <div>{JSON.stringify(m)}</div>;
        break;
      case "whoami":
        {
          const token = localStorage.getItem("gd-authtoken");
          if (!token) {
            output = <div>Not logged in.</div>;
          } else {
            try {
              const res = await fetch(`${apiBase}/me`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (!res.ok) {
                output = <div>Invalid or expired token.</div>;
              } else {
                const data = await res.json();
                output = <div>{data["username"]}</div>;
              }
            } catch (err) {
              output = (
                <div>{err && err.message ? err.message : String(err)}</div>
              );
            }
          }
        }
        break;
      case "logout":
        {
          if (!localStorage.getItem("gd-authtoken")) {
            output = <div>Please login first to logout</div>;
          } else {
            localStorage.removeItem("gd-authtoken");
            output = <div>Logged out successfully.</div>;
          }
        }
        break;
      default:
        if (command.startsWith("echo ")) {
          output = command.substring(5);
        } else {
          output = `Command not found: ${command}`;
        }
    }

    if (output) {
      newHistory.push({ type: "output", content: output });
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="w-full my-[40px] mx-auto">
      <div className="overflow-hidden shadow-sm rounded-lg bg-[#282c34] h-[80vh] pb-4">
        <div className="bg-[#3c3f41] py-2 px-3 flex items-center">
          <span className="rounded-full w-3 h-3 mx-1 bg-[#ff5f56]"></span>
          <span className="rounded-full w-3 h-3 mx-1 bg-[#ffbd2e]"></span>
          <span className="rounded-full w-3 h-3 mx-1 bg-[#27c93f]"></span>
          <span className="text-[#ddd] text-sm ml-2.5">
            gOS Terminal v1.0.0
          </span>
        </div>
        <div
          className="p-4 h-full overflow-y-auto text-[#f8f8f2] text-sm"
          ref={historyRef}
          style={{
            fontFamily: "monospace",
          }}
        >
          {history.map((item, index) => (
            <div
              key={index}
              className={`mt-1 whitespace-pre-wrap break-words ${item.type}`}
            >
              {item.content}
            </div>
          ))}
          <div className="flex mt-2">
            <span className="text-[#50fa7b]">user@system:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none text-[#f8f8f2] pl-1 text-sm flex gap-1 outline-none w-full"
              spellCheck={false}
              style={{
                fontFamily: "monospace",
              }}
              autoFocus
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .command {
          color: #50fa7b;
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen min-w-full bg-gray-900 text-white p-4">
      <Terminal />

      <div className="w-full flex justify-center text-gray-300">
        <h1>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/shrehanrajsingh"
            className="underline text-indigo-400 hover:text-indigo-500"
          >
            shrehanrajsingh
          </a>
        </h1>
      </div>
    </div>
  );
}
