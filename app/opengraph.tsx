// 공유용
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "LLM 기반 덕성여대 교내장학금 안내 챗봇";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 카드 텍스트용 서브셋 폰트, 실패 시 시스템 폰트로 폴백
let pretendardBold: Buffer | null = null;
try {
  pretendardBold = await readFile(
    join(process.cwd(), "public/assets/pretendard-bold-subset.otf"),
  );
} catch (error) {
  console.error("OG 폰트 로드 실패:", error);
}

// 프로필이미지, 없을 시 텍스트만 보이기
let ogImage: string | null = null;
try {
  const buf = await readFile(
    join(process.cwd(), "public/assets/img-og.png"),
    "base64",
  );
  ogImage = `data:image/png;base64,${buf}`;
} catch {
  ogImage = null;
}

const GOLD = "#e8b96b";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: ogImage ? "flex-start" : "center",
        padding: "0 108px",
        background: "linear-gradient(145deg, #16305a 0%, #0b1830 100%)",
        fontFamily: "Pretendard",
      }}
    >
      {ogImage ? (
        // next/og는 <img>만 지원
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ogImage}
          width={420}
          height={344}
          alt=""
          style={{ flexShrink: 0 }}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: ogImage ? "flex-start" : "center",
          marginLeft: ogImage ? 60 : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            color: GOLD,
            textTransform: "uppercase",
          }}
        >
          LLM Chatbot
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -2,
            color: "#ffffff",
            marginTop: 18,
          }}
        >
          덕장이
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 520,
            fontSize: 38,
            lineHeight: 1.35,
            color: "#b9c4d4",
            marginTop: 22,
          }}
        >
          LLM 기반 덕성여대 교내장학금 안내 챗봇
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: pretendardBold
        ? [
            {
              name: "Pretendard",
              data: pretendardBold,
              weight: 700,
              style: "normal",
            },
          ]
        : [],
    },
  );
}
