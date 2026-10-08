# 개발 환경과 품질 검사

## 설치

Node.js 24 이상과 npm이 필요합니다. 저장소 루트에서 의존성을 설치하고 로컬 환경 변수를 준비합니다.

```sh
npm ci
cp .env.example .env.local
./scripts/install-git-hooks.sh
```

`.env.local`의 `API_BASE_URL`은 백엔드 주소를 지정합니다. 기본값은 `http://127.0.0.1:8000`입니다. 백엔드를 먼저 실행한 뒤 `npm run dev`로 프론트엔드를 시작합니다. 주소를 변경했다면 개발 서버를 다시 시작합니다.

설치 스크립트는 버전 관리되는 `.githooks/pre-commit`을 로컬 저장소의 `core.hooksPath`로 등록합니다. 저장소를 새로 clone한 경우에도 한 번 실행합니다.

## 커밋 전 검사

커밋할 때 다음 검사를 자동으로 수행합니다.

1. 스테이징된 JS/TS 파일에 ESLint 자동 수정을 적용하고 Prettier로 포맷한다.
2. 전체 ESLint 검사 (`npm run lint`, 경고도 실패 처리)
3. Prettier 검사 (`npm run format:check`)
4. TypeScript 검사 (`npm run typecheck`)
5. Vitest 단위/컴포넌트 테스트 (`npm test`)
6. App Router 코드가 있을 때 Next.js 프로덕션 빌드 (`npm run build`)

하나라도 실패하면 커밋이 중단됩니다. `lint-staged`가 스테이지된 파일을 수정할 수 있으므로 커밋 전에 diff를 확인합니다. Vitest 테스트가 없으면 검사에 실패합니다.

한 번에 실행:

```sh
npm run check
```

`npm run check`는 로컬과 GitHub Actions에서 사용하는 품질 검사 명령입니다. 작업 지침과 구현 루프는 저장소 루트의 [`AGENTS.md`](../AGENTS.md)를 따릅니다. GitHub Actions가 통과해도 브랜치 보호 규칙은 별도 설정이 필요합니다. 저장소 관리자는 `quality / lint, format, types, tests, build` 검사를 필수 체크로 지정할 수 있습니다.

자동 테스트는 Vitest와 jsdom을 사용합니다. Playwright E2E 테스트는 설정하지 않았으며 검사 대상에서 제외합니다. 사용자가 직접 실행하는 시나리오는 [`TEST_CASE.md`](TEST_CASE.md)에 정리되어 있습니다.
