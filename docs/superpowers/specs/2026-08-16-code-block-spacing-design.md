# Code Block Spacing Design

## Goal

상세 노트에서 fenced code block 위아래의 과도한 여백을 줄여 본문 흐름을 더 촘촘하게 만든다.

## Design

- `figure[data-rehype-pretty-code-figure]`의 세로 바깥 여백을 `2rem`에서 `0.8rem`으로 줄인다.
- 좌우 바깥 여백은 `0`을 유지한다.
- 문장 안의 inline code, 코드 블록 내부 padding, 제목 표시줄과 복사 버튼 규격은 변경하지 않는다.
- 라이트 모드와 다크 모드에 같은 간격을 적용한다.

## Verification

- 스타일 회귀 테스트에서 코드 블록의 `margin: 0.8rem 0`을 검증한다.
- 전체 테스트와 Quartz 빌드로 기존 레이아웃 및 배포 생성을 확인한다.
