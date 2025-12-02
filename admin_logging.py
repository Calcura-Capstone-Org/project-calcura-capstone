# admin_logging.py

from datetime import datetime
from enum import Enum
from typing import List, Optional, Any
from uuid import UUID


# =========================
# ENUMS
# =========================

class AdminActionType(Enum):
  """Type of action an admin took."""

  LOGIN = "LOGIN"
  LOGOUT = "LOGOUT"
  CREATE_USER = "CREATE_USER"
  UPDATE_USER = "UPDATE_USER"
  DELETE_USER = "DELETE_USER"
  VIEW_LOGS = "VIEW_LOGS"
  OTHER = "OTHER"


# =========================
# DOMAIN / VALUE OBJECTS
# =========================

class AdminLog:
  """
  Domain object representing a single admin action log entry.
  """

  def __init__(
    self,
    log_id: UUID,
    admin_id: UUID,
    action_type: AdminActionType,
    target_user_id: Optional[UUID],
    details: str,
    ip_address: str,
    created_at: datetime,
  ) -> None:
    self.id = log_id
    self.admin_id = admin_id
    self.action_type = action_type
    self.target_user_id = target_user_id
    self.details = details
    self.ip_address = ip_address
    self.created_at = created_at

  def isSecuritySensitive(self) -> bool:
    """
    Decide if this log entry is security-sensitive (for example: login, password reset).
    """
    # TODO: return True for certain action types
    raise NotImplementedError("isSecuritySensitive is not implemented yet.")

  def toDict(self) -> dict:
    """
    Convert this log entry into a plain dictionary (for JSON or CSV export).
    """
    # TODO: return a dictionary with the main fields
    raise NotImplementedError("toDict is not implemented yet.")


class LogExportOptions:
  """
  Options controlling how logs should be exported.
  format: 'csv' or 'json'
  include_sensitive: whether to include security-sensitive records.
  """

  def __init__(self, format: str, include_sensitive: bool) -> None:
    self.format = format  # "csv" or "json"
    self.include_sensitive = include_sensitive

  def validate(self) -> None:
    """
    Validate that the format and options are acceptable.
    """
    # TODO: check that format is one of the allowed values
    raise NotImplementedError("LogExportOptions.validate is not implemented yet.")


class AdminLogFilter:
  """
  Filtering options when listing admin logs.
  All fields are optional.
  """

  def __init__(
    self,
    admin_id: Optional[UUID] = None,
    target_user_id: Optional[UUID] = None,
    action_type: Optional[AdminActionType] = None,
    from_timestamp: Optional[datetime] = None,
    to_timestamp: Optional[datetime] = None,
  ) -> None:
    self.admin_id = admin_id
    self.target_user_id = target_user_id
    self.action_type = action_type
    self.from_timestamp = from_timestamp
    self.to_timestamp = to_timestamp

  def matches(self, log: AdminLog) -> bool:
    """
    Check if a given AdminLog matches this filter.
    (This might be used when filtering in memory or in unit tests.)
    """
    # TODO: implement checks for each non-None filter field
    raise NotImplementedError("AdminLogFilter.matches is not implemented yet.")


# =========================
# REPOSITORY & DB SESSION
# =========================

class DatabaseSession:
  """
  Very simple database session wrapper.
  In a real project this would wrap a connection / ORM session.
  """

  def __init__(self, connection: Any) -> None:
    self.connection = connection

  def begin(self) -> None:
    # TODO: start a transaction
    raise NotImplementedError("DatabaseSession.begin is not implemented yet.")

  def commit(self) -> None:
    # TODO: commit the transaction
    raise NotImplementedError("DatabaseSession.commit is not implemented yet.")

  def rollback(self) -> None:
    # TODO: roll back the transaction
    raise NotImplementedError("DatabaseSession.rollback is not implemented yet.")


class AdminLogRepository:
  """
  Repository responsible for loading and saving AdminLog records.
  """

  def __init__(self, db: DatabaseSession) -> None:
    self.db = db

  def save(self, log: AdminLog) -> None:
    """
    Insert a new log record into the database.
    """
    # TODO: perform INSERT statement using self.db
    raise NotImplementedError("AdminLogRepository.save is not implemented yet.")

  def getById(self, log_id: UUID) -> AdminLog:
    """
    Load a single log record by id.
    """
    # TODO: query the database and return an AdminLog
    raise NotImplementedError("AdminLogRepository.getById is not implemented yet.")

  def listFiltered(self, filter: AdminLogFilter) -> List[AdminLog]:
    """
    List all logs that match the given filter.
    """
    # TODO: run a SELECT with WHERE clauses based on the filter
    raise NotImplementedError("AdminLogRepository.listFiltered is not implemented yet.")


# =========================
# SERVICE LAYER
# =========================

class AdminLogService:
  """
  Service that coordinates logging and retrieval of admin log entries.
  """

  def __init__(self, log_repository: AdminLogRepository) -> None:
    self.log_repository = log_repository

  def recordAction(
    self,
    admin_id: UUID,
    action_type: AdminActionType,
    target_user_id: Optional[UUID],
    details: str,
    ip_address: str,
  ) -> AdminLog:
    """
    Create and save a new AdminLog entry for an admin action.
    """
    # TODO: construct an AdminLog with current timestamp and save it
    raise NotImplementedError("AdminLogService.recordAction is not implemented yet.")

  def getLogById(self, log_id: UUID) -> AdminLog:
    """
    Get a single AdminLog entry by its id.
    """
    # TODO: delegate to repository.getById
    raise NotImplementedError("AdminLogService.getLogById is not implemented yet.")

  def listLogs(self, filter: AdminLogFilter) -> List[AdminLog]:
    """
    Get a list of logs matching the given filter.
    """
    # TODO: delegate to repository.listFiltered
    raise NotImplementedError("AdminLogService.listLogs is not implemented yet.")

  def exportLogs(
    self,
    filter: AdminLogFilter,
    options: LogExportOptions,
  ) -> str:
    """
    Export logs to a string in the requested format (for example CSV or JSON).
    """
    # TODO: load logs, apply options, and build CSV/JSON string
    raise NotImplementedError("AdminLogService.exportLogs is not implemented yet.")


# =========================
# CONTROLLER
# =========================

class AdminLogController:
  """
  Controller handling HTTP requests related to admin logs.
  Matches the AdminLogController in the class diagram.
  """

  def __init__(self, log_service: AdminLogService) -> None:
    self.log_service = log_service

  def getLogs(self, request: Any) -> Any:
    """
    Handle a request to list logs (with filters from query params).
    Returns a Response object (framework-specific).
    """
    # TODO: parse filter from request, call log_service.listLogs
    raise NotImplementedError("AdminLogController.getLogs is not implemented yet.")

  def getLogById(self, request: Any) -> Any:
    """
    Handle a request to get a single log entry by id.
    """
    # TODO: read log_id from request, call log_service.getLogById
    raise NotImplementedError("AdminLogController.getLogById is not implemented yet.")

  def getExport(self, request: Any) -> Any:
    """
    Handle a request to export logs (CSV/JSON).
    """
    # TODO: parse filter and export options, call log_service.exportLogs
    raise NotImplementedError("AdminLogController.getExport is not implemented yet.")
