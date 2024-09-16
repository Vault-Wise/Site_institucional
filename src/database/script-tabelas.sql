DROP DATABASE IF EXISTS VaulWise;
CREATE DATABASE VaulWise;
USE VaulWise;

CREATE TABLE Empresa(
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
cnpj CHAR(14) UNIQUE,
cep CHAR(8),
razaoSocial VARCHAR(45),
telefone CHAR(9) UNIQUE,
email VARCHAR(45) UNIQUE,
senha VARCHAR(45)
);

CREATE TABLE usuario(
idUsuario INT AUTO_INCREMENT,
cpf CHAR(11) UNIQUE,
nome VARCHAR(45),
email VARCHAR(45) UNIQUE,
telefone CHAR(9) UNIQUE,
cargo VARCHAR(45),
senha VARCHAR(45),
fkEmpresa INT,

    FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa),
    PRIMARY KEY (idusuario, fkEmpresa)
);



CREATE TABLE Equipamento(
idEquipamento INT AUTO_INCREMENT,
nomeEquipamento VARCHAR(45),
sistemaoperacional VARCHAR(45),
totaldisco VARCHAR(45),
totalmemoria VARCHAR(45),
fkEmpresa INT,

    FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa),
    PRIMARY KEY (idEquipamento)
);

CREATE TABLE Dado (
idDado INT AUTO_INCREMENT,
cpufreq VARCHAR(45),
cpupercent VARCHAR(45),
memoriausada VARCHAR(45),
memoriapercent VARCHAR(45),
discousada VARCHAR(45),
discopercent VARCHAR(45),
estado VARCHAR(45),
dthora DATETIME DEFAULT CURRENT_TIMESTAMP,
fkEquipamento INT,
fkEmpresa INT,

    FOREIGN KEY (fkEquipamento) REFERENCES Equipamento (idEquipamento),
    FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa),
    PRIMARY KEY (idDado, fkEquipamento, fkEmpresa)
);

INSERT INTO Empresa VALUES
(DEFAULT, '12345678910111', '99999999', "Empresa XPTO", '999999999', "xpto@gmail.com", "999");

INSERT INTO Equipamento VALUES
(DEFAULT, 'Teste', "Windows", "1TB", "8GB",1);

SELECT * FROM Dado;
SELECT * FROM Equipamento;

SELECT d.cpupercent, d.memoriapercent, d.discopercent, d.dthora,e.nomeEquipamento FROM Dado AS d JOIN Equipamento AS e ON fkEquipamento = idEquipamento;