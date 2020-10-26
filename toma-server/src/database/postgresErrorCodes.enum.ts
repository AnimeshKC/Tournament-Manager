enum PostgresErrorCode {
  UniqueViolation = "23505",
  CheckViolation = "23514",
  ExclusionViolation = "23P01",
  NonNullViolation = "23502",
  RestrictViolation = "23001",
  IntegrityConstraintViolation = "23000",
}
export default PostgresErrorCode;
