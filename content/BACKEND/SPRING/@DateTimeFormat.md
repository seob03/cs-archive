---
created: 2026-02-27T21:15:00+09:00
notion-id: 314737bad00c8046a003ff6da7cbe549
---
**문자열 ↔ 날짜/시간 타입**(Date/LocalDate/LocalDateTime 등) 변환 규칙을 지정한다. iso나 pattern(직접 패턴) 같은 옵션을 쓴다. 

```java
@GetMapping("/logs")
public String logs(
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
) { ... }

// ?date=2000-10-31  (ISO.DATE = yyyy-MM-dd)
```

```java
// 커스텀 패턴
@GetMapping("/logs")
public String logs(
    @RequestParam @DateTimeFormat(pattern = "yyyyMMdd") LocalDate date
) { ... }
// ?date=20260227
```