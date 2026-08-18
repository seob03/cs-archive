---
created: 2026-08-14T18:08:55+09:00
notion-id: 314737bad00c80a1ba5fce6151c10d84
---
**숫자(Number) ↔ 문자열** 포맷을 지정한다. style(NUMBER/CURRENCY/PERCENT) 또는 pattern(DecimalFormat 패턴) 중 **하나만** 쓴다. pattern이 있으면 style보다 우선한다.

```java
public class ItemForm {
	  @NumberFormat(style = NumberFormat.Style.CURRENCY)
	  private BigDecimal price;
}
```

```java
// 커스텀 패턴
public class ItemForm {
  @NumberFormat(pattern = "#,###.##")
  private BigDecimal weight;
}
```