# plan-docs/ — 기획 문서 인덱스

> 실제 기획 원본 문서는 `docs/plan/YYYYMM/` 에 저장됩니다.
> 이 폴더는 기획 프로세스 가이드, 템플릿, 인덱스를 관리합니다.

---

## 폴더 구조

```
docs/plan-docs/
├── README.md              ← 지금 이 파일 (인덱스·가이드)
├── TEMPLATE.md            ← 기획 문서 작성 템플릿
└── INDEX.md               ← 전체 기획 문서 목록 (자동 갱신)
```

실제 기획 문서 위치:
```
docs/plan/
├── 202603/                ← 2026년 3월 기획 문서들
└── 202604/                ← 2026년 4월 기획 문서들
    ├── ai-stack-cost-calculator.md
    ├── national-pension-generational-comparison-2026.md
    └── ...
```

---

## 기획 문서 작성 원칙

1. **파일명**: `docs/plan/YYYYMM/<slug>.md`
2. **언제 작성**: 구현 시작 전 반드시 기획 문서 존재 여부 확인
3. **최소 포함 내용**:
   - 배경·목적
   - 타겟 사용자
   - 입력값·출력값 정의
   - 섹션 구성
   - SEO 키워드
   - 데이터 출처

---

## 기획 → 설계 → 구현 흐름

```
1. docs/plan/YYYYMM/<slug>.md 작성
2. docs/design/YYYYMM/<slug>-design.md 작성
3. 구현 (data → scss → astro → js)
4. npm run build 확인
5. DEPLOY_CHECKLIST.md 기준 QA
6. main 브랜치 배포
```

---

## 현재 기획 중인 항목 (최신순)

| slug | 상태 | 기획 문서 | 설계 문서 |
|---|---|---|---|
| ai-stack-cost-calculator | 설계 완료 | [링크](../plan/202604/ai-stack-cost-calculator.md) | [링크](../design/202604/ai-stack-cost-calculator-design.md) |
| national-pension-generational-comparison-2026 | 구현 완료 | [링크](../plan/202604/national-pension-generational-comparison-2026.md) | [링크](../design/202604/national-pension-generational-comparison-2026-design.md) |
| postpartum-center-cost-2026 | 구현 완료 | [링크](../plan/202604/postpartum-center-cost-2026.md) | [링크](../design/202604/postpartum-center-cost-2026-design.md) |
